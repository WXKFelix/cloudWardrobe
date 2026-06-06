import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '@/constants/theme';

export interface AvatarPickerRef {
  open: () => void;
}

interface AvatarPickerProps {
  uri: string | null;
  fallbackText: string;
  onChange: (uri: string | null) => void;
  size?: number;
  style?: ViewStyle;
  showBadge?: boolean;
}

export const AvatarPicker = forwardRef<AvatarPickerRef, AvatarPickerProps>(function AvatarPicker(
  { uri, fallbackText, onChange, size = 64, style, showBadge = true },
  ref
) {
  const [showActions, setShowActions] = useState(false);
  const [uploading, setUploading] = useState(false);

  const open = () => setShowActions(true);
  const close = () => setShowActions(false);

  useImperativeHandle(ref, () => ({ open }));

  const pickFromLibrary = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        close();
        Alert.alert('需要相册权限', '请在系统设置中允许访问相册');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    close();

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      onChange(result.assets[0].uri);
      setUploading(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      await pickFromLibrary();
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      close();
      Alert.alert('需要相机权限', '请在系统设置中允许访问相机');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    close();

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      onChange(result.assets[0].uri);
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    close();
    onChange(null);
  };

  const radiusSize = size / 2;
  const actions = [
    { key: 'library', icon: 'images-outline' as const, label: '从相册选择', onPress: pickFromLibrary },
    ...(Platform.OS !== 'web'
      ? [{ key: 'camera', icon: 'camera-outline' as const, label: '拍照', onPress: takePhoto }]
      : []),
    ...(uri
      ? [
          {
            key: 'remove',
            icon: 'trash-outline' as const,
            label: '移除当前头像',
            onPress: removeAvatar,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <Pressable
        onPress={open}
        style={({ pressed }) => [
          styles.wrap,
          { width: size, height: size },
          pressed && styles.pressed,
          style,
        ]}
        accessibilityLabel="更换头像"
        accessibilityRole="button"
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: size, height: size, borderRadius: radiusSize }]}
          />
        ) : (
          <View style={[styles.fallback, { width: size, height: size, borderRadius: radiusSize }]}>
            <Text style={[styles.fallbackText, { fontSize: size * 0.4 }]}>
              {fallbackText?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        {showBadge ? (
          <View style={styles.badge}>
            <Ionicons name="camera" size={14} color="#FFF" />
          </View>
        ) : null}
        {uploading ? (
          <View style={[styles.uploadOverlay, { width: size, height: size, borderRadius: radiusSize }]}>
            <Text style={styles.uploadingText}>上传中</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.overlayBg} onPress={close} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>更换头像</Text>
            <Text style={styles.sheetDesc}>支持 JPG / PNG，建议 1MB 以内</Text>
            {actions.map((action) => (
              <Pressable
                key={action.key}
                onPress={action.onPress}
                style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
              >
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={'danger' in action && action.danger ? colors.error : colors.primary}
                />
                <Text
                  style={[
                    styles.actionLabel,
                    'danger' in action && action.danger && styles.actionDanger,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={close} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  pressed: { opacity: 0.85 },
  image: { backgroundColor: colors.surfaceMuted },
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: { color: '#FFF', fontWeight: '700' },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    zIndex: 2,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  uploadingText: { ...typography.caption, color: '#FFF' },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    margin: spacing.md,
    zIndex: 10,
  },
  sheetTitle: { ...typography.subtitle, color: colors.text, textAlign: 'center' },
  sheetDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionPressed: { backgroundColor: colors.surfaceMuted },
  actionLabel: { ...typography.body, color: colors.text },
  actionDanger: { color: colors.error },
  cancelBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: { ...typography.label, color: colors.textSecondary },
});
