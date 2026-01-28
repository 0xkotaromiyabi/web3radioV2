
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import { useCallback } from 'react';
import { useMiniKitContext } from '@/hooks/useMiniKitContext';

const Index = () => {
  const { isFrameReady, user, client, location } = useMiniKitContext();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <Radio />
        </div>
      </div>
    </div>
  );
};

export default Index;
