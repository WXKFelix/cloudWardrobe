import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { userTypeLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const menuItems = [
  { icon: '☁️', label: '云空间管理', desc: '查看用量与扩容' },
  { icon: '👑', label: '会员中心', desc: '积分 · 等级 · 权益' },
  { icon: '📦', label: '我的订单', desc: '仓储 · 取衣 · 保养' },
  { icon: '💬', label: '意见反馈', desc: '帮助我们改进' },
  { icon: '⚙️', label: '设置', desc: '通知 · 隐私 · 主题' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { username, userType, cloudUsed, cloudQuota, logout } = useAppStore();
  const quotaPercent = Math.round((cloudUsed / cloudQuota) * 100);

  const handleLogout = () => {
    logout();
    router.replace('/welcome');
  };

  return (
    <ScreenContainer>
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{username?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{username || '用户'}</Text>
          <Text style={styles.type}>{userType ? userTypeLabels[userType] : '未设置'}</Text>
        </View>
      </Card>

      <Card style={styles.quotaCard}>
        <View style={styles.quotaHeader}>
          <Text style={styles.quotaTitle}>☁️ 云空间</Text>
          <Text style={styles.quotaCount}>
            {cloudUsed}/{cloudQuota} 件
          </Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${quotaPercent}%` }]} />
        </View>
        <Text style={styles.quotaHint}>
          {quotaPercent >= 80 ? '空间即将用完，建议扩容或存入仓库' : '新用户专享 50 件免费额度'}
        </Text>
      </Card>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable key={item.label} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <Button title="退出登录" onPress={handleLogout} variant="outline" style={{ marginTop: spacing.lg }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, color: '#FFF', fontWeight: '700' },
  profileInfo: { flex: 1 },
  name: { ...typography.subtitle, color: colors.text },
  type: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  quotaCard: { marginBottom: spacing.lg },
  quotaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  quotaTitle: { ...typography.label, color: colors.text },
  quotaCount: { ...typography.label, color: colors.primary },
  progressBg: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  quotaHint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  menu: { gap: spacing.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: { fontSize: 24 },
  menuText: { flex: 1 },
  menuLabel: { ...typography.label, color: colors.text },
  menuDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  menuArrow: { fontSize: 22, color: colors.textMuted },
});
