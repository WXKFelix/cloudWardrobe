import { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';

const apiUrl = process.env.EXPO_PUBLIC_TRY_ON_API_URL || 'http://localhost:8787';
const supportedImage = /^data:image\/(jpeg|png|webp);base64,/i;

export interface TryOnGarment {
  category: 'top' | 'outerwear' | 'bottom' | 'shoes';
  image: string;
}

export function ClothingTryOn({ garments, outfit = false }: { garments: TryOnGarment[]; outfit?: boolean }) {
  const [personImage, setPersonImage] = useState<string>();
  const [resultImage, setResultImage] = useState<string>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  const choosePhoto = async () => {
    setError('');
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: Platform.OS !== 'web',
        quality: 0.85,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const image = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      if (!supportedImage.test(image)) {
        setError('请选择 JPG、PNG 或 WebP 照片。');
        return;
      }
      setPersonImage(image);
      setResultImage(undefined);
    } catch {
      setError('无法读取照片，请重试。');
    } finally {
      setBusy(false);
    }
  };

  const generate = async () => {
    if (!personImage || request.current) return;
    if (garments.some(({ image }) => !supportedImage.test(image))) {
      setError('请用 JPG、PNG 或 WebP 格式重新录入对应衣物。');
      return;
    }
    setError('');
    setResultImage(undefined);
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/try-on`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personImage, garments }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || typeof data.imageUri !== 'string') {
        setError(typeof data.error === 'string' ? data.error : '生成失败，请稍后重试。');
        return;
      }
      setResultImage(data.imageUri);
    } catch {
      if (!controller.signal.aborted) setError('无法连接试穿服务，请确认服务已启动。');
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{outfit ? '搭配试穿' : '上身预览'}</Text>
      <Text style={styles.hint}>{outfit ? '选择一张本人正面全身照，确保头部和鞋子都在画面内。' : '选择一张你自己的正面照，尽量拍全肩部和上半身。'}</Text>
      <Button
        title={personImage ? '更换本人照片' : '选择本人照片'}
        onPress={() => void choosePhoto()}
        disabled={busy}
        variant="outline"
      />
      {personImage ? (
        <>
          <Image source={{ uri: personImage }} style={styles.image} resizeMode="contain" accessibilityLabel="本人照片" />
          <Text style={styles.hint}>点击生成后，本人照片和衣物照片将发送给阿里云百炼进行图像编辑。</Text>
          <Button
            title={busy ? '处理中…' : outfit ? '生成搭配预览' : '生成上身预览'}
            onPress={() => void generate()}
            disabled={busy}
          />
        </>
      ) : null}
      {error ? <Text style={styles.hint} accessibilityLiveRegion="polite">{error}</Text> : null}
      {resultImage ? (
        <>
          <Image source={{ uri: resultImage }} style={styles.result} resizeMode="contain" accessibilityLabel="生成的上身预览" />
          <Text style={styles.hint}>AI 生成的搭配效果，仅供视觉参考。</Text>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  title: { ...typography.subtitle, color: colors.text },
  hint: { ...typography.body, color: colors.textSecondary },
  image: { width: '100%', height: 180 },
  result: { width: '100%', height: 360 },
});
