import { useEffect, useState } from 'react';

// Safe wrapper for MiniKit context that doesn't crash when MiniKit is not enabled
export function useMiniKitContext() {
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [miniKitAvailable, setMiniKitAvailable] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    // Try to import and use MiniKit dynamically to avoid crashes
    const initMiniKit = async () => {
      try {
        const { useMiniKit } = await import('@coinbase/onchainkit/minikit');
        // MiniKit is available, but we can't call hooks here
        // We'll just mark it as potentially available
        setMiniKitAvailable(true);
      } catch (error) {
        console.log('MiniKit not available:', error);
        setMiniKitAvailable(false);
      }
    };

    initMiniKit();
  }, []);

  // Return safe default values when MiniKit is not available
  return {
    isFrameReady,
    setFrameReady: () => setIsFrameReady(true),
    context,
    user: context?.user,
    client: context?.client,
    location: context?.location,
    miniKitAvailable
  };
}