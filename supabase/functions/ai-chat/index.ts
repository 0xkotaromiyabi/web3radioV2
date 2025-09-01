import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    if (!userMessage || !userMessage.content) {
      throw new Error('No user message found');
    }

    // Simple AI responses for blockchain/crypto context
    const responses = {
      'hello': 'Hello! I\'m your Web3 Radio AI assistant. I can help you with blockchain questions, token information, and trading insights.',
      'token': 'W3R Token is the native token of Web3 Radio. You can earn W3R tokens by listening to the radio and participating in our ecosystem.',
      'blockchain': 'Blockchain is a distributed ledger technology that ensures transparency and decentralization. Web3 Radio operates on multiple chains including Ethereum and Solana.',
      'trading': 'For trading advice, always do your own research (DYOR). Consider market trends, project fundamentals, and risk management.',
      'wallet': 'I can see you have a wallet connected! You can use it to interact with our platform, earn tokens, and access premium features.',
      'price': 'I don\'t have real-time price data, but you can check the latest W3R token price on our marketplace or connect to external price feeds.',
      'nft': 'NFTs (Non-Fungible Tokens) are unique digital assets. Web3 Radio may feature NFT collections related to music and radio content.',
      'help': 'I\'m here to help! You can ask me about:\n- Blockchain basics\n- W3R tokens\n- Trading tips\n- Wallet management\n- Web3 Radio features'
    };

    // Simple keyword matching for demo purposes
    const content = userMessage.content.toLowerCase();
    let responseText = "I'm a blockchain-focused AI assistant. I can help you with Web3, tokens, trading, and blockchain technology. What would you like to know?";

    for (const [keyword, response] of Object.entries(responses)) {
      if (content.includes(keyword)) {
        responseText = response;
        break;
      }
    }

    // For more complex queries, provide a generic helpful response
    if (content.length > 50) {
      responseText = "That's an interesting question about Web3! While I'm focused on blockchain and cryptocurrency topics, I'd recommend checking our documentation or community channels for detailed information. Is there something specific about tokens, trading, or blockchain technology I can help clarify?";
    }

    const response = {
      content: responseText,
      session_id: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Something went wrong with the AI chat',
        content: 'Sorry, I\'m having technical difficulties. Please try again!',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});