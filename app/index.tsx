import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingComplete } from '@/lib/onboarding';
import { colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const done = await isOnboardingComplete();
      router.replace(done ? '/(tabs)' : '/onboarding');
      setBooting(false);
    })();
  }, [router]);

  if (booting) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return null;
}
