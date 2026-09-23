import AsyncStorage from '@react-native-async-storage/async-storage';
import { createId } from '@/lib/id';
import type { JobOfferInput } from '@/lib/schemas/job-offer';
import type { JobOfferResult } from '@/engine/job-offer';
import type { DailyCheckin, DecisionRecord, LifeStage, Profile } from '@/lib/db.types';

const STORE_KEY = 'quantified_life_store_v1';

type WebStore = {
  profile: Profile | null;
  stages: LifeStage[];
  checkins: DailyCheckin[];
  decisions: DecisionRecord[];
};

const emptyStore = (): WebStore => ({
  profile: null,
  stages: [],
  checkins: [],
  decisions: [],
});

async function readStore(): Promise<WebStore> {
  const raw = await AsyncStorage.getItem(STORE_KEY);
  if (!raw) {
    return emptyStore();
  }
  try {
    return { ...emptyStore(), ...(JSON.parse(raw) as WebStore) };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: WebStore): Promise<void> {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export async function getProfile(): Promise<Profile | null> {
  const store = await readStore();
  return store.profile;
}

export async function upsertProfile(
  partial: Omit<Profile, 'id'> & { id?: string },
): Promise<void> {
  const store = await readStore();
  const id = partial.id ?? 'default';
  store.profile = {
    id,
    northStar: partial.northStar,
    valueRisk: partial.valueRisk,
    valueGrowth: partial.valueGrowth,
    valueStability: partial.valueStability,
    anchorLabel: partial.anchorLabel,
    currentStage: partial.currentStage,
  };
  await writeStore(store);
}

export async function listStages(): Promise<LifeStage[]> {
  const store = await readStore();
  return [...store.stages].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export async function addStage(stage: Omit<LifeStage, 'id'> & { id?: string }): Promise<void> {
  const store = await readStore();
  store.stages.push({
    id: stage.id ?? createId(),
    title: stage.title,
    location: stage.location,
    narrative: stage.narrative,
    startedAt: stage.startedAt,
    endedAt: stage.endedAt,
  });
  await writeStore(store);
}

export async function upsertCheckin(
  date: string,
  energy: number,
  alignment: number,
  mood: number,
): Promise<void> {
  const store = await readStore();
  const idx = store.checkins.findIndex((c) => c.date === date);
  if (idx >= 0) {
    store.checkins[idx] = { ...store.checkins[idx], energy, alignment, mood };
  } else {
    store.checkins.push({ id: createId(), date, energy, alignment, mood });
  }
  await writeStore(store);
}

export async function listCheckins(limit = 7): Promise<DailyCheckin[]> {
  const store = await readStore();
  return [...store.checkins]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export async function saveDecision(
  input: JobOfferInput,
  result: JobOfferResult,
): Promise<string> {
  const store = await readStore();
  const id = createId();
  store.decisions.unshift({
    id,
    type: 'job_offer',
    payloadJson: JSON.stringify(input),
    resultJson: JSON.stringify(result),
    reviewAt: result.reviewAt,
    reviewed: false,
    createdAt: new Date().toISOString(),
  });
  await writeStore(store);
  return id;
}

export async function listDecisions(): Promise<DecisionRecord[]> {
  const store = await readStore();
  return [...store.decisions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markDecisionReviewed(id: string): Promise<void> {
  const store = await readStore();
  const row = store.decisions.find((d) => d.id === id);
  if (row) {
    row.reviewed = true;
    await writeStore(store);
  }
}

export async function exportAllTables(): Promise<string> {
  const store = await readStore();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      profile: store.profile,
      stages: store.stages,
      checkins: store.checkins,
      decisions: store.decisions,
    },
    null,
    2,
  );
}
