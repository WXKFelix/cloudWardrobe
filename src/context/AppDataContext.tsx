import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getProfile,
  listCheckins,
  listDecisions,
  listStages,
  type DailyCheckin,
  type DecisionRecord,
  type LifeStage,
  type Profile,
} from '@/lib/db';

type AppDataContextValue = {
  ready: boolean;
  profile: Profile | null;
  stages: LifeStage[];
  checkins: DailyCheckin[];
  decisions: DecisionRecord[];
  refresh: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stages, setStages] = useState<LifeStage[]>([]);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);

  const refresh = useCallback(async () => {
    const [p, s, c, d] = await Promise.all([
      getProfile(),
      listStages(),
      listCheckins(7),
      listDecisions(),
    ]);
    setProfile(p);
    setStages(s);
    setCheckins(c);
    setDecisions(d);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh().catch(() => setReady(true));
  }, [refresh]);

  const value = useMemo(
    () => ({ ready, profile, stages, checkins, decisions, refresh }),
    [ready, profile, stages, checkins, decisions, refresh],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}
