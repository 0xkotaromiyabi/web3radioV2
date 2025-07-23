import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export function useMiniKitContext() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return {
    isFrameReady,
    setFrameReady,
    context,
    user: context?.user,
    client: context?.client,
    location: context?.location
  };
}