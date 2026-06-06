import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { colors, shadows } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: '衣橱',
          tabBarIcon: ({ color, size }) => <Ionicons name="shirt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '录入',
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <Ionicons name="add" size={28} color="#FFF" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '记录',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceGlass,
    borderTopColor: colors.techBorder,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.tech,
    ...shadows.glow,
  },
});
