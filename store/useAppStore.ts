import { create } from 'zustand';
import {
  ClothingItem,
  Order,
  UserType,
  mockClothing,
  mockOrders,
  mockOutfitDays,
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
  cloudUsed: number;
  membershipLevel: 'free' | 'standard' | 'premium';
  points: number;
  orders: Order[];
  settings: AppSettings;
  clothing: ClothingItem[];
  outfitDays: number[];
  todayOutfitIndex: number;
  todayOutfitConfirmed: boolean;
  login: (username: string) => void;
  register: (username: string, userType: UserType) => void;
  logout: () => void;
  completeOnboarding: () => void;
  refreshOutfit: () => void;
  confirmOutfit: () => void;
  addClothing: (item: Omit<ClothingItem, 'id' | 'wearCount' | 'lastWornDaysAgo' | 'status'>) => void;
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
  cloudUsed: mockClothing.length,
  membershipLevel: 'free',
  points: 320,
  orders: mockOrders,
  settings: {
    notifyOutfit: true,
    notifyPromo: true,
    notifyOrder: true,
    darkMode: false,
    privacyShare: false,
  },
  clothing: mockClothing,
  outfitDays: mockOutfitDays,
  todayOutfitIndex: 0,
  todayOutfitConfirmed: false,

  login: (username) =>
    set({
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      username,
      userType: 'worker',
      cloudUsed: mockClothing.length,
    }),

  register: (username, userType) =>
    set({
      isAuthenticated: true,
      hasCompletedOnboarding: false,
      username,
      userType,
      cloudUsed: 0,
      clothing: [],
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      username: '',
      avatarUri: null,
      userType: null,
      todayOutfitIndex: 0,
      todayOutfitConfirmed: false,
      membershipLevel: 'free',
      points: 320,
      orders: mockOrders,
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
      todayOutfitConfirmed: false,
    });
  },

  confirmOutfit: () => {
    const today = new Date().getDate();
    const { clothing, todayOutfitIndex, todayOutfitConfirmed } = get();
    const { items } = getOutfitRecommendation(clothing, todayOutfitIndex);
    if (!items.length || todayOutfitConfirmed) return;
    const wornIds = new Set(items.map((item) => item.id));
    set((state) => ({
      todayOutfitConfirmed: true,
      outfitDays: state.outfitDays.includes(today)
        ? state.outfitDays
        : [...state.outfitDays, today],
      clothing: state.clothing.map((item) =>
        wornIds.has(item.id)
          ? { ...item, wearCount: item.wearCount + 1, lastWornDaysAgo: 0 }
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
        lastWornDaysAgo: -1,
        status: 'normal',
      };
      return {
        clothing: [newItem, ...state.clothing],
        todayOutfitIndex: 0,
        todayOutfitConfirmed: false,
        cloudUsed: state.cloudUsed + 1,
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

export function getWardrobeOverview(clothing: ClothingItem[]) {
  const categories = [
    { key: 'top', label: '上衣', count: clothing.filter((c) => c.category === 'top').length },
    { key: 'bottom', label: '裤子', count: clothing.filter((c) => c.category === 'bottom').length },
    { key: 'shoes', label: '鞋子', count: clothing.filter((c) => c.category === 'shoes').length },
    {
      key: 'outerwear',
      label: '外套',
      count: clothing.filter((c) => c.category === 'outerwear').length,
    },
  ];
  return {
    total: clothing.length,
    weeklyOutfits: 4,
    categories,
  };
}
