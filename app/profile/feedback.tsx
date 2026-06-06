import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { feedbackCategories } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function FeedbackScreen() {
  const router = useRouter();
  const [category, setCategory] = useState(feedbackCategories[0]);
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [attached, setAttached] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (content.trim().length < 10) {
      setError('反馈内容至少 10 个字');
      return;
    }
    setError('');
    setShowSuccess(true);
    setContent('');
    setContact('');
    setAttached(false);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="意见反馈" onBack={() => router.back()} />

      <Text style={styles.label}>反馈类型</Text>
      <View style={styles.chips}>
        {feedbackCategories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, category === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="反馈内容"
        value={content}
        onChangeText={setContent}
        placeholder="请描述你的问题或建议（至少 10 字）"
        multiline
        numberOfLines={5}
        style={styles.textarea}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Input
        label="联系方式（选填）"
        value={contact}
        onChangeText={setContact}
        placeholder="手机号或邮箱，方便我们回复"
        style={{ marginTop: spacing.md }}
      />

      <Pressable onPress={() => setAttached(true)} style={styles.attachBtn}>
        <Text style={styles.attachIcon}>📎</Text>
        <Text style={styles.attachText}>
          {attached ? '已添加截图（模拟）' : '添加截图'}
        </Text>
      </Pressable>

      <Button title="提交反馈" onPress={handleSubmit} style={{ marginTop: spacing.lg }} />

      <ModalSheet
        visible={showSuccess}
        title="✅ 提交成功"
        message="感谢你的反馈！我们会在 24 小时内处理并回复。"
        primaryAction={{
          label: '返回',
          onPress: () => {
            setShowSuccess(false);
            router.back();
          },
        }}
        onClose={() => {
          setShowSuccess(false);
          router.back();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: '#FFF' },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  attachIcon: { fontSize: 20 },
  attachText: { ...typography.body, color: colors.textSecondary },
});
