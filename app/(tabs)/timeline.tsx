import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { TimelineNode } from '@/components/TimelineNode';
import { useAppData } from '@/context/AppDataContext';
import { addStage } from '@/lib/db';
import { colors, spacing } from '@/constants/theme';

export default function TimelineScreen() {
  const { stages, refresh } = useAppData();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [narrative, setNarrative] = useState('');
  const [showForm, setShowForm] = useState(false);

  const submit = async () => {
    if (title.trim().length < 2) {
      Alert.alert('请填写阶段名称');
      return;
    }
    await addStage({
      title: title.trim(),
      location: location.trim() || null,
      narrative: narrative.trim() || null,
      startedAt: new Date().toISOString().slice(0, 10),
      endedAt: null,
    });
    setTitle('');
    setLocation('');
    setNarrative('');
    setShowForm(false);
    await refresh();
  };

  return (
    <Screen>
      <Text style={styles.lead}>从 A 出发，记录你路过的 B、C…… 半径小不代表空白。</Text>

      {showForm ? (
        <>
          <TextField label="阶段名称" value={title} onChangeText={setTitle} placeholder="例如：研究生阶段" />
          <TextField label="地点（可选）" value={location} onChangeText={setLocation} placeholder="例如：北京" />
          <TextField
            label="回忆（可选）"
            value={narrative}
            onChangeText={setNarrative}
            multiline
            placeholder="这段经历对你意味着什么？"
          />
          <Button label="保存阶段" onPress={submit} />
          <Button variant="secondary" label="取消" onPress={() => setShowForm(false)} />
        </>
      ) : (
        <Button label="添加阶段" onPress={() => setShowForm(true)} />
      )}

      {stages.length === 0 ? (
        <Text style={styles.empty}>还没有阶段，点击上方按钮添加。</Text>
      ) : (
        stages.map((s, i) => <TimelineNode key={s.id} stage={s} isFirst={i === 0} />)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  empty: {
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
