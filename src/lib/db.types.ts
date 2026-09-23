export type Profile = {
  id: string;
  northStar: string;
  valueRisk: number;
  valueGrowth: number;
  valueStability: number;
  anchorLabel: string;
  currentStage: string;
};

export type LifeStage = {
  id: string;
  title: string;
  location: string | null;
  narrative: string | null;
  startedAt: string;
  endedAt: string | null;
};

export type DailyCheckin = {
  id: string;
  date: string;
  energy: number;
  alignment: number;
  mood: number;
};

export type DecisionRecord = {
  id: string;
  type: 'job_offer';
  payloadJson: string;
  resultJson: string;
  reviewAt: string;
  reviewed: boolean;
  createdAt: string;
};
