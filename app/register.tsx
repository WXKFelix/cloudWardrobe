import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useAppStore } from '@/store/useAppStore';
import { colors, spacing, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAppStore((s) => s.register);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGift, setShowGift] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (username.length < 4) next.username = '账号至少 4 个字符';
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || password.length < 8) {
      next.password = '密码需 8 位以上，含字母和数字';
    }
    if (password !== confirm) next.confirm = '两次密码不一致';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    register(username.trim(), 'worker');
    setShowGift(true);
  };

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 返回</Text>
      </Pressable>

      <Text style={styles.title}>创建账号</Text>
      <Text style={styles.subtitle}>加入云衣柜，开启随性穿衣</Text>

      <Input
        label="账号名称"
        value={username}
        onChangeText={setUsername}
        placeholder="4-20 个字符"
        error={errors.username}
      />
      <Input
        label="密码"
        value={password}
        onChangeText={setPassword}
        placeholder="8 位以上，含字母和数字"
        secureTextEntry
        error={errors.password}
        style={{ marginTop: spacing.md }}
      />
      <Input
        label="确认密码"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="再次输入密码"
        secureTextEntry
        error={errors.confirm}
        style={{ marginTop: spacing.md }}
      />

      <Button title="注册" onPress={handleRegister} style={{ marginTop: spacing.lg }} />

      <ModalSheet
        visible={showGift}
        title="🎉 欢迎加入云衣柜！"
        message="已为您开通专享云空间，可免费存储 50 件衣物。"
        primaryAction={{
          label: '开始录入第一件衣物',
          onPress: () => {
            setShowGift(false);
            router.replace('/onboarding/user-type');
          },
        }}
        secondaryAction={{
          label: '稍后再说',
          onPress: () => {
            setShowGift(false);
            router.replace('/onboarding/user-type');
          },
        }}
        onClose={() => {
          setShowGift(false);
          router.replace('/onboarding/user-type');
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { marginBottom: spacing.lg },
  backText: { ...typography.body, color: colors.primary },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
});
