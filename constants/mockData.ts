export type UserType = 'student' | 'worker' | 'family';

export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory';

export interface ClothingItem {
  imageUri?: string;
  tryOnImageUri?: string;
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorHex: string;
  season: string;
  occasion: string;
  wearCount: number;
  lastWornAt: string | null;
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

export const mockFashionTips = [
  { id: '1', title: '2025 春夏流行色', desc: '薄荷绿搭配米白，清爽又高级' },
  { id: '2', title: '通勤穿搭法则', desc: '上繁下简，轻松打造职场质感' },
];

export type OrderType = 'storage' | 'pickup' | 'care';
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  type: OrderType;
  title: string;
  status: OrderStatus;
  date: string;
  amount: number;
  items: string[];
  trackingNo?: string;
}

export const orderTypeLabels: Record<OrderType, string> = {
  storage: '仓储',
  pickup: '取衣',
  care: '保养',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: '待支付',
  processing: '处理中',
  shipping: '配送中',
  completed: '已完成',
  cancelled: '已取消',
};

export const cloudPlans = [
  { id: 'free', name: '免费版', quota: 50, price: 0, desc: '新用户专享' },
  { id: 'standard', name: '标准版', quota: 100, price: 15, desc: '月付 ¥15' },
  { id: 'premium', name: '尊享版', quota: 200, price: 39, desc: '月付 ¥39' },
];

export const membershipBenefits = [
  { icon: '☁️', title: '云空间扩容', desc: '标准版 100 件 / 尊享版 200 件' },
  { icon: '✨', title: '高级穿搭推荐', desc: '无限次换一套，AI 深度分析' },
  { icon: '📦', title: '免费取衣 2 次/月', desc: '尊享版专享' },
  { icon: '🧼', title: '保养 8 折', desc: '门店洗护服务折扣' },
];

export const feedbackCategories = ['功能建议', '穿搭推荐', '订单物流', '账号问题', '其他'];
