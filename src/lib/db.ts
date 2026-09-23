import { Platform } from 'react-native';
import * as web from '@/lib/db.web';
import * as native from '@/lib/db.native';

export type {
  Profile,
  LifeStage,
  DailyCheckin,
  DecisionRecord,
} from '@/lib/db.types';

const api = Platform.OS === 'web' ? web : native;

export const getProfile = api.getProfile;
export const upsertProfile = api.upsertProfile;
export const listStages = api.listStages;
export const addStage = api.addStage;
export const upsertCheckin = api.upsertCheckin;
export const listCheckins = api.listCheckins;
export const saveDecision = api.saveDecision;
export const listDecisions = api.listDecisions;
export const markDecisionReviewed = api.markDecisionReviewed;
export const exportAllTables = api.exportAllTables;
