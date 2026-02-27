import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useAudio } from '../contexts/AudioProvider';

export function useCapacitorLifecycle() {
    const { handleBackground, handleForeground } = useAudio();

    useEffect(() => {
        const setupListener = async () => {
            const listener = await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
                console.log('App active:', isActive);

                if (!isActive) {
                    handleBackground();
                } else {
                    handleForeground();
                }
            });

            return listener;
        };

        const listenerPromise = setupListener();

        return () => {
            listenerPromise.then(listener => {
                listener.remove();
            });
        };
    }, [handleBackground, handleForeground]);
}
