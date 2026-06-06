import { create } from 'zustand';
import {
  ClothingItem,
  UserType,
  mockClothing,
  mockOutfitDays,
  wardrobeStats,
} from '@/constants/mockData';

interface AppState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  username: string;
  userType: UserType | null;
  cloudQuota: number;
  cloudUsed: number;
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
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  username: '',
  userType: null,
  cloudQuota: 50,
  cloudUsed: mockClothing.length,
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
      userType: null,
      todayOutfitIndex: 0,
      todayOutfitConfirmed: false,
    }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  refreshOutfit: () => {
    const { todayOutfitIndex } = get();
    set({ todayOutfitIndex: (todayOutfitIndex + 1) % 2, todayOutfitConfirmed: false });
  },

  confirmOutfit: () => {
    const today = new Date().getDate();
    set((state) => ({
      todayOutfitConfirmed: true,
      outfitDays: state.outfitDays.includes(today)
        ? state.outfitDays
        : [...state.outfitDays, today],
      clothing: state.clothing.map((item, index) =>
        index < 3 ? { ...item, wearCount: item.wearCount + 1, lastWornDaysAgo: 0 } : item
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
        cloudUsed: state.cloudUsed + 1,
      };
    }),
}));

export const outfitPresets = [
  {
    title: '清爽通勤风',
    desc: '适合今日 22°C 晴好天气，简约干练',
    items: ['蓝色条纹衬衫', '黑色休闲裤', '白色运动鞋'],
    emojis: ['👔', '👖', '👟'],
  },
  {
    title: '休闲周末风',
    desc: '轻松舒适，适合外出散步或咖啡时光',
    items: ['灰色针织开衫', '黑色休闲裤', '白色运动鞋'],
    emojis: ['🧶', '👖', '👟'],
  },
];

export function getWardrobeOverview(clothing: ClothingItem[]) {
  if (clothing.length === 0) return wardrobeStats;
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
