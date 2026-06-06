export type UserType = 'student' | 'worker' | 'family';

export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorHex: string;
  season: string;
  occasion: string;
  wearCount: number;
  lastWornDaysAgo: number;
  status: 'normal' | 'washing' | 'in_storage';
  emoji: string;
}

export const categoryLabels: Record<ClothingCategory, string> = {
  top: '上衣',
  bottom: '裤子',
  shoes: '鞋子',
  outerwear: '外套',
  accessory: '配饰',
};

export const userTypeLabels: Record<UserType, string> = {
  student: '学生党',
  worker: '上班族',
  family: '家庭用户',
};

export const mockClothing: ClothingItem[] = [
  {
    id: '1',
    name: '蓝色条纹衬衫',
    category: 'top',
    color: '蓝',
    colorHex: '#4A7FBF',
    season: '春夏',
    occasion: '通勤',
    wearCount: 12,
    lastWornDaysAgo: 3,
    status: 'normal',
    emoji: '👔',
  },
  {
    id: '2',
    name: '黑色休闲裤',
    category: 'bottom',
    color: '黑',
    colorHex: '#2C2C2C',
    season: '四季',
    occasion: '日常',
    wearCount: 8,
    lastWornDaysAgo: 1,
    status: 'normal',
    emoji: '👖',
  },
  {
    id: '3',
    name: '白色运动鞋',
    category: 'shoes',
    color: '白',
    colorHex: '#F5F5F5',
    season: '四季',
    occasion: '运动',
    wearCount: 15,
    lastWornDaysAgo: 0,
    status: 'normal',
    emoji: '👟',
  },
  {
    id: '4',
    name: '米色风衣',
    category: 'outerwear',
    color: '米',
    colorHex: '#D4C4A8',
    season: '春秋',
    occasion: '通勤',
    wearCount: 5,
    lastWornDaysAgo: 90,
    status: 'normal',
    emoji: '🧥',
  },
  {
    id: '5',
    name: '灰色针织开衫',
    category: 'outerwear',
    color: '灰',
    colorHex: '#9E9E9E',
    season: '秋冬',
    occasion: '休闲',
    wearCount: 6,
    lastWornDaysAgo: 14,
    status: 'washing',
    emoji: '🧶',
  },
  {
    id: '6',
    name: '藏青西裤',
    category: 'bottom',
    color: '藏青',
    colorHex: '#1B2A4A',
    season: '四季',
    occasion: '正式',
    wearCount: 10,
    lastWornDaysAgo: 5,
    status: 'normal',
    emoji: '👔',
  },
];

export const mockOutfitDays = [1, 2, 4, 5, 6];

export const mockReminders = [
  { id: '1', text: '白色衬衫已 14 天未洗', type: 'warning' as const },
  { id: '2', text: '冬装建议存入云仓库', type: 'info' as const },
];

export const mockFashionTips = [
  { id: '1', title: '2025 春夏流行色', desc: '薄荷绿搭配米白，清爽又高级' },
  { id: '2', title: '通勤穿搭法则', desc: '上繁下简，轻松打造职场质感' },
];

export const wardrobeStats = {
  total: 52,
  weeklyOutfits: 4,
  categories: [
    { key: 'top', label: '上衣', count: 18 },
    { key: 'bottom', label: '裤子', count: 12 },
    { key: 'shoes', label: '鞋子', count: 8 },
    { key: 'outerwear', label: '外套', count: 14 },
  ],
};
