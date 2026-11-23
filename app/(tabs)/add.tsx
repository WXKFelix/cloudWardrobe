import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { ClothingCategory, categoryLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const categories: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];
const colorOptions = [
  { name: '黑', hex: '#2C2C2C' },
  { name: '白', hex: '#F5F5F5' },
  { name: '蓝', hex: '#4A7FBF' },
  { name: '灰', hex: '#9E9E9E' },
  { name: '米', hex: '#D4C4A8' },
];

export default function AddScreen() {
  const router = useRouter();
  const addClothing = useAppStore((s) => s.addClothing);
  const cloudUsed = useAppStore((s) => s.clothing.length);
  const cloudQuota = useAppStore((s) => s.cloudQuota);
  const [mode, setMode] = useState<'photo' | 'manual'>('photo');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('top');
  const [color, setColor] = useState(colorOptions[0]);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();
  const imageUri = photo?.uri;
  const [photoError, setPhotoError] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickPhoto = async (source: 'camera' | 'library') => {
    setPhotoError('');
    setIsPicking(true);

    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPhotoError('请在系统设置中允许使用相机，或从相册选择照片。');
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1, base64: Platform.OS !== 'web' };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) setPhoto(result.assets[0]);
    } catch {
      setPhotoError('无法打开照片，请重试。');
    } finally {
      setIsPicking(false);
    }
  };

  const handleSave = () => {
    const savedImageUri = mode === 'photo' ? imageUri : undefined;
    if (mode === 'photo' && !savedImageUri) return;
    const clothingName = name.trim() || (savedImageUri ? categoryLabels[category] : '');
    if (!clothingName) return;
    const emojiMap: Record<ClothingCategory, string> = {
      top: '👔',
      bottom: '👖',
      shoes: '👟',
      outerwear: '🧥',
      accessory: '👜',
    };
    addClothing({
      name: clothingName,
      imageUri: savedImageUri,
      tryOnImageUri: savedImageUri && photo?.base64 ? `data:image/jpeg;base64,${photo.base64}` : undefined,
      category,
      color: color.name,
      colorHex: color.hex,
      season: '四季',
      occasion: '日常',
      emoji: emojiMap[category],
    });
    setShowSuccess(true);
    setName('');
    setPhoto(undefined);
    setPhotoError('');
  };

  const resetAndGoWardrobe = () => {
    setShowSuccess(false);
    router.push('/(tabs)/wardrobe');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>录入衣物</Text>
      <Text style={styles.subtitle}>
        云空间 {cloudUsed}/{cloudQuota} 件
      </Text>

      <View style={styles.modeSwitch}>
        <Pressable
          onPress={() => setMode('photo')}
          style={[styles.modeBtn, mode === 'photo' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>📸 照片录入</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('manual')}
          style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeText, mode === 'manual' && styles.modeTextActive]}>✏️ 手动添加</Text>
        </Pressable>
      </View>

      {mode === 'photo' ? (
        <Card style={styles.photoCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="contain" accessibilityLabel="衣物照片预览" />
          ) : (
            <View style={styles.photoArea}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.photoHint}>平铺衣物，拍下完整正面</Text>
            </View>
          )}
          <View style={styles.photoActions}>
            <Button
              title={imageUri ? '更换照片' : Platform.OS === 'web' ? '选择照片' : '从相册选择'}
              onPress={() => void pickPhoto('library')}
              disabled={isPicking}
              variant="outline"
              style={styles.photoButton}
            />
            {Platform.OS !== 'web' ? (
              <Button
                title={imageUri ? '重拍' : '拍照'}
                onPress={() => void pickPhoto('camera')}
                disabled={isPicking}
                style={styles.photoButton}
              />
            ) : null}
          </View>
          {photoError ? <Text accessibilityLiveRegion="polite" style={styles.photoError}>{photoError}</Text> : null}
        </Card>
      ) : null}

      <Input label={mode === 'photo' ? '衣物名称（选填）' : '衣物名称'} value={name} onChangeText={setName} placeholder="例如：蓝色条纹衬衫" />

      <Text style={styles.fieldLabel}>类别</Text>
      <View style={styles.chips}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, category === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
              {categoryLabels[cat]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.fieldLabel}>颜色</Text>
      <View style={styles.chips}>
        {colorOptions.map((c) => (
          <Pressable
            key={c.name}
            onPress={() => setColor(c)}
            style={[styles.colorChip, color.name === c.name && styles.colorChipActive]}
          >
            <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
            <Text style={styles.chipText}>{c.name}</Text>
          </Pressable>
        ))}
      </View>

      <Button
        title="保存到衣橱"
        onPress={handleSave}
        disabled={isPicking || (mode === 'photo' ? !imageUri : !name.trim())}
        style={{ marginTop: spacing.lg }}
      />

      <ModalSheet
        visible={showSuccess}
        title="✅ 录入成功"
        message="衣物已添加到本次会话的衣橱。"
        primaryAction={{ label: '查看衣橱', onPress: resetAndGoWardrobe }}
        secondaryAction={{
          label: '继续录入',
          onPress: () => setShowSuccess(false),
        }}
        onClose={() => setShowSuccess(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  modeSwitch: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modeBtnActive: { borderColor: colors.tech, backgroundColor: colors.ecoMuted },
  modeText: { ...typography.label, color: colors.textSecondary },
  modeTextActive: { color: colors.primary },
  photoCard: { marginBottom: spacing.md },
  photoArea: {
    height: 180,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 40 },
  photo: { width: '100%', height: 240, backgroundColor: colors.surfaceMuted, borderRadius: radius.md },
  photoActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  photoButton: { flex: 1 },
  photoHint: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  photoError: { ...typography.caption, color: colors.text, marginTop: spacing.sm },
  fieldLabel: { ...typography.label, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: '#FFF', fontWeight: '600' },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorChipActive: { borderColor: colors.primary, borderWidth: 2 },
  colorDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
});
