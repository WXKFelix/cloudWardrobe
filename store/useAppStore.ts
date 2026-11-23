import { create } from 'zustand';
import {
  ClothingItem,
  categoryLabels,
  Order,
  UserType,
} from '@/constants/mockData';

export interface AppSettings {
  notifyOutfit: boolean;
  notifyPromo: boolean;
  notifyOrder: boolean;
  darkMode: boolean;
  privacyShare: boolean;
}

interface AppState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  username: string;
  avatarUri: string | null;
  userType: UserType | null;
  cloudQuota: number;
  membershipLevel: 'free' | 'standard' | 'premium';
  points: number;
  orders: Order[];
  settings: AppSettings;
  clothing: ClothingItem[];
  outfitDays: string[];
  todayOutfitIndex: number;
  login: (username: string) => void;
  register: (username: string, userType: UserType) => void;
  logout: () => void;
  completeOnboarding: () => void;
  refreshOutfit: () => void;
  confirmOutfit: () => void;
  addClothing: (item: Omit<ClothingItem, 'id' | 'wearCount' | 'lastWornAt' | 'status'>) => void;
  expandCloudQuota: (quota: number, level: 'free' | 'standard' | 'premium') => void;
  redeemPoints: (cost: number) => boolean;
  updateSettings: (patch: Partial<AppSettings>) => void;
  cancelOrder: (orderId: string) => void;
  setAvatar: (uri: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  username: '',
  avatarUri: null,
  userType: null,
  cloudQuota: 50,
  membershipLevel: 'free',
  points: 0,
  orders: [],
  settings: {
    notifyOutfit: true,
    notifyPromo: true,
    notifyOrder: true,
    darkMode: false,
    privacyShare: false,
  },
  clothing: [],
  outfitDays: [],
  todayOutfitIndex: 0,

  login: (username) =>
    set({
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      username,
      userType: 'worker',
    }),

  register: (username, userType) =>
    set({
      isAuthenticated: true,
      hasCompletedOnboarding: false,
      username,
      userType,
      clothing: [],
      outfitDays: [],
      todayOutfitIndex: 0,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      username: '',
      avatarUri: null,
      userType: null,
      clothing: [],
      outfitDays: [],
      cloudQuota: 50,
      todayOutfitIndex: 0,
      membershipLevel: 'free',
      points: 0,
      orders: [],
    }),

  expandCloudQuota: (quota, level) =>
    set({ cloudQuota: quota, membershipLevel: level }),

  redeemPoints: (cost) => {
    const { points } = get();
    if (points < cost) return false;
    set({ points: points - cost });
    return true;
  },

  updateSettings: (patch) =>
    set((state) => ({ settings: { ...state.settings, ...patch } })),

  cancelOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId && (o.status === 'pending' || o.status === 'processing')
          ? { ...o, status: 'cancelled' as const }
          : o
      ),
    })),

  setAvatar: (uri) => set({ avatarUri: uri }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  refreshOutfit: () => {
    const { clothing, todayOutfitIndex } = get();
    const { count } = getOutfitRecommendation(clothing, todayOutfitIndex);
    if (count < 2) return;
    set({
      todayOutfitIndex: (todayOutfitIndex + 1) % count,
    });
  },

  confirmOutfit: () => {
    const today = localDateKey(new Date());
    const { clothing, todayOutfitIndex, outfitDays } = get();
    const { items } = getOutfitRecommendation(clothing, todayOutfitIndex);
    if (!items.length || outfitDays.includes(today)) return;
    const wornIds = new Set(items.map((item) => item.id));
    set((state) => ({
      outfitDays: [...state.outfitDays, today],
      clothing: state.clothing.map((item) =>
        wornIds.has(item.id)
          ? { ...item, wearCount: item.wearCount + 1, lastWornAt: today }
          : item
      ),
    }));
  },

  addClothing: (item) =>
    set((state) => {
      const newItem: ClothingItem = {
        ...item,
        id: String(Date.now()),
        wearCount: 0,
        lastWornAt: null,
        status: 'normal',
      };
      return {
        clothing: [newItem, ...state.clothing],
        todayOutfitIndex: 0,
      };
    }),
}));

export function getOutfitRecommendation(clothing: ClothingItem[], index: number) {
  const available = clothing.filter((item) => item.status === 'normal');
  const slots = [
    available.filter((item) => item.category === 'top' || item.category === 'outerwear'),
    available.filter((item) => item.category === 'bottom'),
    available.filter((item) => item.category === 'shoes'),
  ].filter((slot) => slot.length > 0);
  const count = slots.length ? slots.reduce((total, slot) => total * slot.length, 1) : 0;
  let combination = index;
  const items = slots.map((slot) => {
    const item = slot[combination % slot.length];
    combination = Math.floor(combination / slot.length);
    return item;
  });
  return { items, count };
}

export function localDateKey(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, '0')).join('-');
}

export function daysSinceWorn(lastWornAt: string | null, today = new Date()) {
  if (!lastWornAt) return -1;
  return Math.max(0, (Date.parse(localDateKey(today)) - Date.parse(lastWornAt)) / 86_400_000);
}

export function getWardrobeOverview(clothing: ClothingItem[], outfitDays: string[] = [], today = new Date()) {
  const monday = new Date(today);
  monday.setDate(today.getDate() - (today.getDay() + 6) % 7);
  const weekStart = localDateKey(monday);
  const todayKey = localDateKey(today);
  return {
    total: clothing.length,
    weeklyOutfits: outfitDays.filter((day) => day >= weekStart && day <= todayKey).length,
    categories: Object.entries(categoryLabels).map(([key, label]) => ({
      key, label, count: clothing.filter((item) => item.category === key).length,
    })),
  };
}
