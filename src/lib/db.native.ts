import * as SQLite from 'expo-sqlite';
import { createId } from '@/lib/id';
import type { JobOfferInput } from '@/lib/schemas/job-offer';
import type { JobOfferResult } from '@/engine/job-offer';
import type { DailyCheckin, DecisionRecord, LifeStage, Profile } from '@/lib/db.types';

export type { Profile, LifeStage, DailyCheckin, DecisionRecord };

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('quantified_life.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS profile (
          id TEXT PRIMARY KEY NOT NULL,
          north_star TEXT NOT NULL,
          value_risk REAL NOT NULL,
          value_growth REAL NOT NULL,
          value_stability REAL NOT NULL,
          anchor_label TEXT NOT NULL,
          current_stage TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS life_stages (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          location TEXT,
          narrative TEXT,
          started_at TEXT NOT NULL,
          ended_at TEXT
        );
        CREATE TABLE IF NOT EXISTS daily_checkins (
          id TEXT PRIMARY KEY NOT NULL,
          date TEXT NOT NULL UNIQUE,
          energy REAL NOT NULL,
          alignment REAL NOT NULL,
          mood REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS decisions (
          id TEXT PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          result_json TEXT NOT NULL,
          review_at TEXT NOT NULL,
          reviewed INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    northStar: String(row.north_star),
    valueRisk: Number(row.value_risk),
    valueGrowth: Number(row.value_growth),
    valueStability: Number(row.value_stability),
    anchorLabel: String(row.anchor_label),
    currentStage: String(row.current_stage),
  };
}

export async function getProfile(): Promise<Profile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM profile WHERE id = ?',
    ['default'],
  );
  return row ? rowToProfile(row) : null;
}

export async function upsertProfile(
  partial: Omit<Profile, 'id'> & { id?: string },
): Promise<void> {
  const db = await getDb();
  const existing = await getProfile();
  const id = partial.id ?? 'default';
  if (existing) {
    await db.runAsync(
      `UPDATE profile SET north_star = ?, value_risk = ?, value_growth = ?, value_stability = ?,
       anchor_label = ?, current_stage = ? WHERE id = ?`,
      [
        partial.northStar,
        partial.valueRisk,
        partial.valueGrowth,
        partial.valueStability,
        partial.anchorLabel,
        partial.currentStage,
        id,
      ],
    );
  } else {
    await db.runAsync(
      `INSERT INTO profile (id, north_star, value_risk, value_growth, value_stability, anchor_label, current_stage, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        partial.northStar,
        partial.valueRisk,
        partial.valueGrowth,
        partial.valueStability,
        partial.anchorLabel,
        partial.currentStage,
        new Date().toISOString(),
      ],
    );
  }
}

export async function listStages(): Promise<LifeStage[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM life_stages ORDER BY started_at DESC',
  );
  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    location: row.location != null ? String(row.location) : null,
    narrative: row.narrative != null ? String(row.narrative) : null,
    startedAt: String(row.started_at),
    endedAt: row.ended_at != null ? String(row.ended_at) : null,
  }));
}

export async function addStage(stage: Omit<LifeStage, 'id'> & { id?: string }): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO life_stages (id, title, location, narrative, started_at, ended_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      stage.id ?? createId(),
      stage.title,
      stage.location,
      stage.narrative,
      stage.startedAt,
      stage.endedAt,
    ],
  );
}

export async function upsertCheckin(
  date: string,
  energy: number,
  alignment: number,
  mood: number,
): Promise<void> {
  const db = await getDb();
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM daily_checkins WHERE date = ?',
    [date],
  );
  if (existing) {
    await db.runAsync(
      'UPDATE daily_checkins SET energy = ?, alignment = ?, mood = ? WHERE date = ?',
      [energy, alignment, mood, date],
    );
  } else {
    await db.runAsync(
      'INSERT INTO daily_checkins (id, date, energy, alignment, mood) VALUES (?, ?, ?, ?, ?)',
      [createId(), date, energy, alignment, mood],
    );
  }
}

export async function listCheckins(limit = 7): Promise<DailyCheckin[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM daily_checkins ORDER BY date DESC LIMIT ?',
    [limit],
  );
  return rows.map((row) => ({
    id: String(row.id),
    date: String(row.date),
    energy: Number(row.energy),
    alignment: Number(row.alignment),
    mood: Number(row.mood),
  }));
}

export async function saveDecision(
  input: JobOfferInput,
  result: JobOfferResult,
): Promise<string> {
  const db = await getDb();
  const id = createId();
  await db.runAsync(
    `INSERT INTO decisions (id, type, payload_json, result_json, review_at, reviewed, created_at)
     VALUES (?, 'job_offer', ?, ?, ?, 0, ?)`,
    [id, JSON.stringify(input), JSON.stringify(result), result.reviewAt, new Date().toISOString()],
  );
  return id;
}

export async function listDecisions(): Promise<DecisionRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM decisions ORDER BY created_at DESC',
  );
  return rows.map((row) => ({
    id: String(row.id),
    type: 'job_offer' as const,
    payloadJson: String(row.payload_json),
    resultJson: String(row.result_json),
    reviewAt: String(row.review_at),
    reviewed: Number(row.reviewed) === 1,
    createdAt: String(row.created_at),
  }));
}

export async function markDecisionReviewed(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE decisions SET reviewed = 1 WHERE id = ?', [id]);
}

export async function exportAllTables(): Promise<string> {
  const profile = await getProfile();
  const stages = await listStages();
  const checkins = await listCheckins(365);
  const decisions = await listDecisions();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      profile,
      stages,
      checkins,
      decisions,
    },
    null,
    2,
  );
}
