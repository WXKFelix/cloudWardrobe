import type { JobOfferInput } from '@/lib/schemas/job-offer';

export type PathKind = 'accept' | 'stay' | 'negotiate';

export type DecisionPath = {
  kind: PathKind;
  title: string;
  headline: string;
  tags: string[];
  scores: {
    financial: number;
    time: number;
    growth: number;
    stability: number;
    overall: number;
  };
  summary: string;
};

export type JobOfferResult = {
  paths: DecisionPath[];
  assumptions: string[];
  reviewAt: string;
};

const TAX_FACTOR = 0.75;
const WORK_HOURS_YEAR = 2000;

function impliedHourly(salary: number): number {
  return salary / WORK_HOURS_YEAR;
}

function commuteHoursYear(minutesOneWay: number): number {
  return (minutesOneWay * 2 * 250) / 60;
}

function financialDelta(input: JobOfferInput): number {
  return (input.offerSalary - input.currentSalary) * TAX_FACTOR;
}

function timeBurdenScore(input: JobOfferInput, hourly: number): number {
  const commuteCost = commuteHoursYear(input.commuteMinutes) * hourly;
  const overtimeCost = input.overtimeHoursPerWeek * 52 * hourly * 0.6;
  const normalized = commuteCost + overtimeCost;
  return Math.max(0, 100 - normalized / 200);
}

function weight(input: JobOfferInput) {
  const total = input.riskTolerance + input.stabilityNeed + input.growthScore;
  return {
    growth: input.growthScore / total,
    stability: input.stabilityNeed / total,
    risk: input.riskTolerance / total,
  };
}

function overall(
  financial: number,
  time: number,
  growth: number,
  stability: number,
  w: ReturnType<typeof weight>,
  kind: PathKind,
): number {
  let g = growth;
  let s = stability;
  let f = financial;
  const t = time;

  if (kind === 'stay') {
    g = Math.max(0, growth - 15);
    f = Math.min(100, 50 + (100 - financial) * 0.3);
    s = Math.min(100, stability + 10);
  }
  if (kind === 'negotiate') {
    f = Math.min(100, financial * 0.85 + 40);
    g = Math.min(100, growth + 5);
  }

  const raw =
    f * 0.35 * (1 - w.stability * 0.3) +
    t * 0.25 +
    g * 0.25 * (0.5 + w.growth) +
    s * 0.15 * (0.5 + w.stability);

  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function evaluateJobOffer(input: JobOfferInput): JobOfferResult {
  const hourly = impliedHourly(input.currentSalary);
  const delta = financialDelta(input);
  const timeScore = timeBurdenScore(input, hourly);
  const w = weight(input);

  const financialAccept = Math.min(
    100,
    Math.max(0, 50 + (delta / Math.max(input.currentSalary * 0.1, 1)) * 25),
  );
  const growthAccept = input.growthScore * 10;
  const stabilityAccept = Math.max(0, 100 - input.riskTolerance * 8);

  const paths: DecisionPath[] = [
    {
      kind: 'accept',
      title: '接受 Offer',
      headline:
        delta >= 0
          ? `粗算税后年增约 ¥${Math.round(delta).toLocaleString()}`
          : `税后年减约 ¥${Math.round(Math.abs(delta)).toLocaleString()}，需靠成长/意义补偿`,
      tags: ['新环境', delta > 0 ? '收入上行' : '收入承压'],
      scores: {
        financial: Math.round(financialAccept),
        time: Math.round(timeScore),
        growth: Math.round(growthAccept),
        stability: Math.round(stabilityAccept),
        overall: overall(financialAccept, timeScore, growthAccept, stabilityAccept, w, 'accept'),
      },
      summary:
        input.commuteMinutes > 60
          ? '通勤偏重，确认能否远程或减少往返。'
          : '若成长评分可信，接受可扩大选项空间。',
    },
    {
      kind: 'stay',
      title: '留任现职',
      headline: '保留已知性与现有关系资本',
      tags: ['低变动', '机会成本'],
      scores: {
        financial: Math.round(Math.max(0, 70 - (delta > 0 ? delta / input.currentSalary : 0) * 30)),
        time: Math.round(Math.min(100, timeScore + 15)),
        growth: Math.round(Math.max(0, growthAccept - 20)),
        stability: Math.round(Math.min(100, stabilityAccept + 15)),
        overall: overall(financialAccept, timeScore + 15, growthAccept - 20, stabilityAccept + 15, w, 'stay'),
      },
      summary:
        input.stabilityNeed >= 7
          ? '稳定需求高时，留任是合理基线方案。'
          : '若成长分低，留任可能放大长期停滞风险。',
    },
  ];

  const showNegotiate =
    (delta > 0 && delta / Math.max(input.currentSalary, 1) < 0.15) ||
    input.commuteMinutes > 45 ||
    input.offerSalary < input.currentSalary;

  if (showNegotiate) {
    paths.push({
      kind: 'negotiate',
      title: '谈判 / 延期决定',
      headline: '争取薪资、远程或入职时间，再对比',
      tags: ['提高可逆性', '信息补全'],
      scores: {
        financial: Math.round(Math.min(100, financialAccept * 0.9 + 10)),
        time: Math.round(timeScore + 5),
        growth: Math.round(Math.min(100, growthAccept + 5)),
        stability: Math.round(stabilityAccept + 5),
        overall: overall(financialAccept, timeScore + 5, growthAccept + 5, stabilityAccept + 5, w, 'negotiate'),
      },
      summary: '在信息不足或边际收益不大时，谈判优于立刻二选一。',
    });
  }

  paths.sort((a, b) => b.scores.overall - a.scores.overall);

  const assumptions: string[] = [
    `若 Offer 成长空间低于 ${Math.max(1, input.growthScore - 2)} 分，接受路径优势会明显下降。`,
    `若单程通勤超过 ${input.commuteMinutes + 20} 分钟，时间成本可能推翻财务收益。`,
    `若「${input.nonNegotiables[0] || '底线'}」被持续侵蚀，三条路径都需重新评估。`,
    delta > 0
      ? '假设当前职级年收与 Offer 口径一致（均含奖金预期）。'
      : '假设降薪部分可在 12 个月内通过晋升/奖金回补。',
  ];

  const review = new Date();
  review.setDate(review.getDate() + 30);

  return {
    paths,
    assumptions,
    reviewAt: review.toISOString().slice(0, 10),
  };
}
