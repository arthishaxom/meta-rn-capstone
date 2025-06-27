import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const loadProfile = useAuthStore((state) => state.loadProfile);

  useEffect(() => {
    async function prepare() {
      await loadProfile();
      setIsReady(true);
    }
    prepare();
  }, []);

  if (!isReady) {
    return null; // or a loading component
  }

  return <Redirect href={isOnboarded ? '/(tabs)' : '/onboarding'} />;
}
