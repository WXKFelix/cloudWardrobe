import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useAppStore } from '@/store/useAppStore';
import { colors, spacing, typography } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    login(username.trim());
    setShowPromo(true);
  };

  const enterApp = () => {
    setShowPromo(false);
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 返回</Text>
      </Pressable>

      <Text style={styles.title}>欢迎回来</Text>
      <Text style={styles.subtitle}>登录你的云衣柜账号</Text>

      <Input
        label="账号名称"
        value={username}
        onChangeText={setUsername}
        placeholder="请输入账号"
        autoCapitalize="none"
      />
      <Input
        label="密码"
        value={password}
        onChangeText={setPassword}
        placeholder="请输入密码"
        secureTextEntry
        style={{ marginTop: spacing.md }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="登录" onPress={handleLogin} style={{ marginTop: spacing.lg }} />

      <Pressable onPress={() => router.push('/register')} style={styles.linkWrap}>
        <Text style={styles.link}>还没有账号？立即注册</Text>
      </Pressable>

      <ModalSheet
        visible={showPromo}
        title="🎁 会员专享福利"
        message="登录成功！本周穿搭打卡满 5 天，可获赠云空间扩容 10 件。"
        primaryAction={{ label: '进入首页', onPress: enterApp }}
        onClose={enterApp}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { marginBottom: spacing.lg },
  backText: { ...typography.body, color: colors.primary },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.sm },
  linkWrap: { marginTop: spacing.lg, alignItems: 'center' },
  link: { ...typography.body, color: colors.primary },
});
