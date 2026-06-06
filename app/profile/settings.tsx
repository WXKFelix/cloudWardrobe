import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useAppStore();

  return (
    <ScreenContainer>
      <ScreenHeader title="设置" onBack={() => router.back()} />

      <Text style={styles.sectionTitle}>通知设置</Text>
      <Card style={styles.card}>
        <SettingRow
          label="穿搭提醒"
          desc="每日推荐与打卡提醒"
          value={settings.notifyOutfit}
          onChange={(v) => updateSettings({ notifyOutfit: v })}
        />
        <SettingRow
          label="活动推广"
          desc="优惠福利与会员活动"
          value={settings.notifyPromo}
          onChange={(v) => updateSettings({ notifyPromo: v })}
        />
        <SettingRow
          label="订单通知"
          desc="物流状态与取衣提醒"
          value={settings.notifyOrder}
          onChange={(v) => updateSettings({ notifyOrder: v })}
          last
        />
      </Card>

      <Text style={styles.sectionTitle}>隐私设置</Text>
      <Card style={styles.card}>
        <SettingRow
          label="穿搭分享"
          desc="允许好友查看我的穿搭"
          value={settings.privacyShare}
          onChange={(v) => updateSettings({ privacyShare: v })}
          last
        />
      </Card>

      <Text style={styles.sectionTitle}>外观</Text>
      <Card style={styles.card}>
        <SettingRow
          label="深色模式"
          desc="切换深色主题（原型模拟）"
          value={settings.darkMode}
          onChange={(v) => updateSettings({ darkMode: v })}
          last
        />
      </Card>

      <Text style={styles.sectionTitle}>关于</Text>
      <Card style={styles.card}>
        <InfoRow label="当前版本" value="v1.0.0 原型" />
        <InfoRow label="用户协议" value="查看 ›" onPress={() => {}} />
        <InfoRow label="隐私政策" value="查看 ›" onPress={() => {}} last />
      </Card>
    </ScreenContainer>
  );
}

function SettingRow({
  label,
  desc,
  value,
  onChange,
  last,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : '#f4f3f4'}
      />
    </View>
  );
}

function InfoRow({
  label,
  value,
  onPress,
  last,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const content = (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  card: { padding: 0, overflow: 'hidden', marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { flex: 1, marginRight: spacing.md },
  rowLabel: { ...typography.label, color: colors.text },
  rowDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  infoValue: { ...typography.body, color: colors.textMuted },
});
