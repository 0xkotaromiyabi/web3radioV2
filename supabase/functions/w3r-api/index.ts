
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Rate limiting configuration
const RATE_LIMITS = {
  submit_session: { maxRequests: 10, windowMinutes: 60 }, // 10 sessions per hour
  claim_reward: { maxRequests: 5, windowMinutes: 60 }, // 5 claim attempts per hour
}

// Minimum listening time for validation (in seconds)
const MIN_LISTENING_TIME = 30 // 30 seconds minimum
const MAX_LISTENING_TIME = 7200 // 2 hours maximum per session

interface ListeningSession {
  userAddress: string
  startTime: string
  endTime: string
  duration: number
  stationId?: string
}

interface RewardClaimRequest {
  userAddress: string
}

// Rate limiting function
async function checkRateLimit(userAddress: string, actionType: string): Promise<boolean> {
  const limit = RATE_LIMITS[actionType as keyof typeof RATE_LIMITS]
  if (!limit) return true

  const windowStart = new Date(Date.now() - limit.windowMinutes * 60 * 1000)

  // Get current rate limit record
  const { data: rateLimitData } = await supabase
    .from('rate_limiting')
    .select('*')
    .eq('user_address', userAddress)
    .eq('action_type', actionType)
    .single()

  if (!rateLimitData) {
    // Create new rate limit record
    await supabase
      .from('rate_limiting')
      .insert({
        user_address: userAddress,
        action_type: actionType,
        action_count: 1,
        last_action: new Date().toISOString()
      })
    return true
  }

  // Check if we're within the time window
  const lastAction = new Date(rateLimitData.last_action)
  if (lastAction < windowStart) {
    // Reset counter for new window
    await supabase
      .from('rate_limiting')
      .update({
        action_count: 1,
        last_action: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_address', userAddress)
      .eq('action_type', actionType)
    return true
  }

  // Check if under limit
  if (rateLimitData.action_count < limit.maxRequests) {
    // Increment counter
    await supabase
      .from('rate_limiting')
      .update({
        action_count: rateLimitData.action_count + 1,
        last_action: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_address', userAddress)
      .eq('action_type', actionType)
    return true
  }

  return false // Rate limit exceeded
}

// Validate listening session
function validateListeningSession(session: ListeningSession): { valid: boolean; verifiedDuration: number; error?: string } {
  const startTime = new Date(session.startTime).getTime()
  const endTime = new Date(session.endTime).getTime()
  const calculatedDuration = Math.floor((endTime - startTime) / 1000)

  // Basic validation
  if (startTime >= endTime) {
    return { valid: false, verifiedDuration: 0, error: 'Invalid time range' }
  }

  if (calculatedDuration < MIN_LISTENING_TIME) {
    return { valid: false, verifiedDuration: 0, error: 'Listening time too short' }
  }

  if (calculatedDuration > MAX_LISTENING_TIME) {
    return { valid: false, verifiedDuration: 0, error: 'Listening time too long' }
  }

  // Use the smaller of reported or calculated duration for security
  const verifiedDuration = Math.min(session.duration, calculatedDuration)

  // Additional validation: check if duration matches calculated time (with 10% tolerance)
  const tolerance = calculatedDuration * 0.1
  if (Math.abs(session.duration - calculatedDuration) > tolerance) {
    console.warn(`Duration mismatch for ${session.userAddress}: reported=${session.duration}, calculated=${calculatedDuration}`)
    return { valid: true, verifiedDuration: calculatedDuration } // Use calculated time
  }

  return { valid: true, verifiedDuration }
}

// Generate reward signature (simplified - in production, use proper cryptographic signatures)
function generateRewardSignature(userAddress: string, listeningTime: number, rewardAmount: string, nonce: number): string {
  const message = `${userAddress}-${listeningTime}-${rewardAmount}-${nonce}`
  // In production, use proper ECDSA signing with a private key
  // For now, return a hash-based signature
  return btoa(message).slice(0, 64)
}

// Submit listening session endpoint
async function handleSubmitSession(session: ListeningSession) {
  console.log('Submitting listening session:', session)

  // Check rate limit
  const rateLimitOk = await checkRateLimit(session.userAddress, 'submit_session')
  if (!rateLimitOk) {
    return Response.json(
      { success: false, error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: corsHeaders }
    )
  }

  // Validate session
  const validation = validateListeningSession(session)
  if (!validation.valid) {
    return Response.json(
      { success: false, error: validation.error },
      { status: 400, headers: corsHeaders }
    )
  }

  try {
    // Store listening session
    const { data, error } = await supabase
      .from('listening_sessions')
      .insert({
        user_address: session.userAddress,
        start_time: session.startTime,
        end_time: session.endTime,
        duration: validation.verifiedDuration,
        station_id: session.stationId,
        verified: true
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { success: false, error: 'Failed to store session' },
        { status: 500, headers: corsHeaders }
      )
    }

    return Response.json({
      success: true,
      verifiedTime: validation.verifiedDuration,
      sessionId: data[0].id
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error submitting session:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Get verified listening time endpoint
async function handleGetListeningTime(userAddress: string) {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('verified_listening_time')
      .eq('user_address', userAddress)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', error)
      return Response.json(
        { error: 'Failed to fetch listening time' },
        { status: 500, headers: corsHeaders }
      )
    }

    return Response.json({
      totalListeningTime: data?.verified_listening_time || 0
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error getting listening time:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Request reward claim signature endpoint
async function handleRewardClaim(request: RewardClaimRequest) {
  console.log('Processing reward claim for:', request.userAddress)

  // Check rate limit
  const rateLimitOk = await checkRateLimit(request.userAddress, 'claim_reward')
  if (!rateLimitOk) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: corsHeaders }
    )
  }

  try {
    // Get user stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_address', request.userAddress)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Database error:', statsError)
      return Response.json(
        { error: 'Failed to fetch user stats' },
        { status: 500, headers: corsHeaders }
      )
    }

    if (!userStats || userStats.verified_listening_time < 3600) { // 1 hour = 3600 seconds
      return Response.json(
        { error: 'Insufficient listening time for reward' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if user has unclaimed rewards
    const eligibleHours = Math.floor(userStats.verified_listening_time / 3600)
    const { data: claimedRewards } = await supabase
      .from('reward_claims')
      .select('reward_amount')
      .eq('user_address', request.userAddress)
      .eq('claimed', true)

    const totalClaimed = claimedRewards?.reduce((sum, claim) => sum + parseInt(claim.reward_amount), 0) || 0
    const totalEligible = eligibleHours * 100 // 100 W3R per hour
    const availableReward = totalEligible - totalClaimed

    if (availableReward <= 0) {
      return Response.json(
        { error: 'No rewards available to claim' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Generate signature for reward claim
    const nonce = Date.now()
    const rewardAmount = Math.min(availableReward, 100).toString() // Claim up to 100 W3R at once
    const signature = generateRewardSignature(request.userAddress, userStats.verified_listening_time, rewardAmount, nonce)

    // Store reward claim record
    const { data, error } = await supabase
      .from('reward_claims')
      .insert({
        user_address: request.userAddress,
        listening_time: userStats.verified_listening_time,
        reward_amount: rewardAmount,
        signature,
        nonce,
        claimed: false
      })
      .select()

    if (error) {
      console.error('Failed to store reward claim:', error)
      return Response.json(
        { error: 'Failed to process reward claim' },
        { status: 500, headers: corsHeaders }
      )
    }

    return Response.json({
      userAddress: request.userAddress,
      listeningTime: userStats.verified_listening_time,
      rewardAmount,
      signature,
      nonce
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error processing reward claim:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Check reward eligibility endpoint
async function handleCheckEligibility(userAddress: string) {
  try {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_address', userAddress)
      .single()

    if (!userStats) {
      return Response.json({
        eligible: false,
        nextRewardIn: 3600,
        availableRewards: 0
      }, { headers: corsHeaders })
    }

    const eligibleHours = Math.floor(userStats.verified_listening_time / 3600)
    const { data: claimedRewards } = await supabase
      .from('reward_claims')
      .select('reward_amount')
      .eq('user_address', userAddress)
      .eq('claimed', true)

    const totalClaimed = claimedRewards?.reduce((sum, claim) => sum + parseInt(claim.reward_amount), 0) || 0
    const totalEligible = eligibleHours * 100
    const availableRewards = Math.max(0, totalEligible - totalClaimed)
    
    const timeToNextReward = 3600 - (userStats.verified_listening_time % 3600)

    return Response.json({
      eligible: availableRewards > 0,
      nextRewardIn: timeToNextReward,
      availableRewards
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error checking eligibility:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    console.log(`${req.method} ${path}`)

    // Route handling
    if (req.method === 'POST' && path === '/listening/submit') {
      const session: ListeningSession = await req.json()
      return await handleSubmitSession(session)
    }
    
    if (req.method === 'GET' && path.startsWith('/listening/')) {
      const userAddress = path.split('/').pop()
      if (!userAddress) {
        return Response.json(
          { error: 'User address required' },
          { status: 400, headers: corsHeaders }
        )
      }
      return await handleGetListeningTime(userAddress)
    }
    
    if (req.method === 'POST' && path === '/rewards/claim') {
      const request: RewardClaimRequest = await req.json()
      return await handleRewardClaim(request)
    }
    
    if (req.method === 'GET' && path.startsWith('/rewards/check/')) {
      const userAddress = path.split('/').pop()
      if (!userAddress) {
        return Response.json(
          { error: 'User address required' },
          { status: 400, headers: corsHeaders }
        )
      }
      return await handleCheckEligibility(userAddress)
    }

    // Default 404 response
    return Response.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Unhandled error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})
