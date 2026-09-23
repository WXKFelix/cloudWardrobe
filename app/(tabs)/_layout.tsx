import { useCallback } from 'react';
import { Tabs, useFocusEffect } from 'expo-router';
import { Text } from 'react-native';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/constants/theme';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 11, color: focused ? colors.primary : colors.textSecondary }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const { refresh } = useAppData();
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '今日',
          tabBarLabel: ({ focused }) => <TabLabel label="今日" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: '轨迹',
          tabBarLabel: ({ focused }) => <TabLabel label="轨迹" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="decisions"
        options={{
          title: '决策',
          tabBarLabel: ({ focused }) => <TabLabel label="决策" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarLabel: ({ focused }) => <TabLabel label="设置" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
