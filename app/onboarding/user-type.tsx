import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { UserType } from '@/constants/mockData';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, typography } from '@/constants/theme';

const options: { type: UserType; emoji: string; title: string; desc: string }[] = [
  { type: 'student', emoji: '🎓', title: '学生党', desc: '宿舍空间有限，追求性价比穿搭' },
  { type: 'worker', emoji: '💼', title: '上班族', desc: '通勤高效，出差轻装出行' },
  { type: 'family', emoji: '👨‍👩‍👧', title: '家庭用户', desc: '全家衣橱，四季衣物管理' },
];

export default function UserTypeScreen() {
  const router = useRouter();
  const register = useAppStore((s) => s.register);
  const username = useAppStore((s) => s.username);
  const [selected, setSelected] = useState<UserType>('worker');

  const handleNext = () => {
    if (username) {
      register(username, selected);
    }
    router.push('/onboarding/guide');
  };

  return (
    <ScreenContainer>
      <Text style={styles.step}>步骤 1 / 2</Text>
      <Text style={styles.title}>你是哪类用户？</Text>
      <Text style={styles.subtitle}>我们将为你定制穿搭推荐和首页布局</Text>

      <View style={styles.list}>
        {options.map((opt) => {
          const active = selected === opt.type;
          return (
            <Pressable
              key={opt.type}
              onPress={() => setSelected(opt.type)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Button title="下一步" onPress={handleNext} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  step: { ...typography.caption, color: colors.primary, marginBottom: spacing.sm },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionActive: { borderColor: colors.tech, backgroundColor: colors.ecoMuted },
  emoji: { fontSize: 32 },
  optionText: { flex: 1 },
  optionTitle: { ...typography.label, color: colors.text },
  optionTitleActive: { color: colors.primary },
  optionDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
});
