import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { StepIndicator } from '@/components/StepIndicator';
import { TextField } from '@/components/TextField';
import { SliderField } from '@/components/SliderField';
import { Button } from '@/components/Button';
import { jobOfferInputSchema } from '@/lib/schemas/job-offer';
import { evaluateJobOffer } from '@/engine/job-offer';
import { saveDecision } from '@/lib/db';
import { spacing } from '@/constants/theme';

export default function JobOfferWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [currentSalary, setCurrentSalary] = useState('200000');
  const [offerSalary, setOfferSalary] = useState('260000');
  const [commuteMinutes, setCommuteMinutes] = useState('45');
  const [overtime, setOvertime] = useState('5');
  const [growthScore, setGrowthScore] = useState(7);
  const [riskTolerance, setRiskTolerance] = useState(6);
  const [stabilityNeed, setStabilityNeed] = useState(6);
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [n3, setN3] = useState('');
  const [narrative, setNarrative] = useState('');

  const submit = async () => {
    const parsed = jobOfferInputSchema.safeParse({
      currentSalary: Number(currentSalary),
      offerSalary: Number(offerSalary),
      commuteMinutes: Number(commuteMinutes),
      overtimeHoursPerWeek: Number(overtime),
      growthScore,
      riskTolerance,
      stabilityNeed,
      nonNegotiables: [n1.trim(), n2.trim(), n3.trim()],
      narrative: narrative.trim() || undefined,
    });

    if (!parsed.success) {
      Alert.alert('请检查输入', parsed.error.issues[0]?.message ?? '字段无效');
      return;
    }

    const result = evaluateJobOffer(parsed.data);
    const id = await saveDecision(parsed.data, result);
    router.push({
      pathname: '/decision/job-offer/result',
      params: { id },
    });
  };

  return (
    <Screen>
      <StepIndicator
        step={step}
        total={4}
        title={
          step === 1
            ? '财务事实'
            : step === 2
              ? '时间与成长'
              : step === 3
                ? '不可量化底线'
                : '确认并生成路径'
        }
      />

      {step === 1 && (
        <>
          <TextField
            label="当前年薪（税前）"
            value={currentSalary}
            onChangeText={setCurrentSalary}
            keyboardType="numeric"
          />
          <TextField
            label="Offer 年薪（税前）"
            value={offerSalary}
            onChangeText={setOfferSalary}
            keyboardType="numeric"
          />
          <Button label="下一步" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <TextField
            label="单程通勤（分钟）"
            value={commuteMinutes}
            onChangeText={setCommuteMinutes}
            keyboardType="numeric"
          />
          <TextField
            label="预期每周加班（小时）"
            value={overtime}
            onChangeText={setOvertime}
            keyboardType="numeric"
          />
          <SliderField label="Offer 成长空间" value={growthScore} onChange={setGrowthScore} />
          <SliderField label="风险承受" value={riskTolerance} onChange={setRiskTolerance} />
          <SliderField label="稳定需求" value={stabilityNeed} onChange={setStabilityNeed} />
          <Button label="下一步" onPress={() => setStep(3)} />
          <Button variant="secondary" label="上一步" onPress={() => setStep(1)} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.hint}>最不想失去的 3 样（数字无法替代的部分）</Text>
          <TextField label="底线 1" value={n1} onChangeText={setN1} placeholder="例如：陪伴家人的周末" />
          <TextField label="底线 2" value={n2} onChangeText={setN2} />
          <TextField label="底线 3" value={n3} onChangeText={setN3} />
          <TextField
            label="自由叙述（可选）"
            value={narrative}
            onChangeText={setNarrative}
            multiline
          />
          <Button
            label="下一步"
            onPress={() => {
              if ([n1, n2, n3].some((x) => x.trim().length < 2)) {
                Alert.alert('请填写三条底线');
                return;
              }
              setStep(4);
            }}
          />
          <Button variant="secondary" label="上一步" onPress={() => setStep(2)} />
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.hint}>
            我们将用规则引擎粗算财务与时间成本，并给出 2～3 条路径对比（非唯一标准答案）。
          </Text>
          <Button label="生成路径对比" onPress={submit} />
          <Button variant="secondary" label="上一步" onPress={() => setStep(3)} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
});
