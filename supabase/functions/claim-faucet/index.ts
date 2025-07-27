import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()

    if (!address) {
      return new Response(
        JSON.stringify({ error: 'No address provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate address format (basic validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid address format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // TODO: Implement rate limiting (1 claim per minute per address)
    // You can use Supabase database to store last claim timestamps
    
    // Configuration for thirdweb Engine
    const engineUrl = Deno.env.get('THIRDWEB_ENGINE_URL') || 'https://engine.yourdomain.com'
    const accessToken = Deno.env.get('THIRDWEB_ACCESS_TOKEN')
    const backendWallet = Deno.env.get('THIRDWEB_BACKEND_WALLET')
    const contractAddress = Deno.env.get('W3R_TOKEN_CONTRACT') || '0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B'
    
    if (!accessToken || !backendWallet) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const chain = "base"
    const decimals = 18
    const amount = (2 * Math.pow(10, decimals)).toString() // 2 tokens

    // Call thirdweb Engine API
    const response = await fetch(
      `${engineUrl}/contract/${chain}/${contractAddress}/write`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-backend-wallet-address': backendWallet,
        },
        body: JSON.stringify({
          functionName: 'transfer',
          args: [address, amount],
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully claimed 2 W3R tokens!',
          tx: data 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Transfer failed',
          details: data 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Faucet claim error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})