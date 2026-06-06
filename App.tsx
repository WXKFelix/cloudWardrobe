import { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

type WardrobeItem = {
  id: string;
  uri: string;
  name: string;
};

export default function App() {
  const [items, setItems] = useState<WardrobeItem[]>([]);

  const addItemFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    setItems((current) => [
      {
        id: `${Date.now()}`,
        uri: asset.uri,
        name: `衣物 ${current.length + 1}`,
      },
      ...current,
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>云衣柜</Text>
      <Text style={styles.subtitle}>Cloud Wardrobe</Text>

      <Pressable style={styles.button} onPress={addItemFromLibrary}>
        <Text style={styles.buttonText}>从相册添加衣物</Text>
      </Pressable>

      <Text style={styles.count}>已添加 {items.length} 件衣物</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>还没有衣物，点击上方按钮添加。</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f1f2e',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: '#444',
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#ececf3',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
});
