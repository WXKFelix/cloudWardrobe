import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAppStore();

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/user-type" />;
  }

  return <Redirect href="/(tabs)" />;
}
