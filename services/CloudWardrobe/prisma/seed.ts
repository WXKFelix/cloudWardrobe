import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cloud plans — mirrors constants/mockData.ts cloudPlans
  await prisma.cloudPlan.createMany({
    data: [
      {
        id: 'free',
        name: '免费版',
        quota: 50,
        priceCents: 0,
        description: '新用户专享',
        sortOrder: 0,
      },
      {
        id: 'standard',
        name: '标准版',
        quota: 100,
        priceCents: 1500,
        description: '月付 ¥15',
        sortOrder: 1,
      },
      {
        id: 'premium',
        name: '尊享版',
        quota: 200,
        priceCents: 3900,
        description: '月付 ¥39',
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  // Membership benefits — mirrors constants/mockData.ts membershipBenefits
  await prisma.membershipBenefit.createMany({
    data: [
      {
        icon: '☁️',
        title: '云空间扩容',
        description: '标准版 100 件 / 尊享版 200 件',
        sortOrder: 0,
      },
      {
        icon: '✨',
        title: '高级穿搭推荐',
        description: '无限次换一套，AI 深度分析',
        sortOrder: 1,
      },
      {
        planId: 'premium',
        icon: '📦',
        title: '免费取衣 2 次/月',
        description: '尊享版专享',
        sortOrder: 2,
      },
      {
        icon: '🧼',
        title: '保养 8 折',
        description: '门店洗护服务折扣',
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Fashion tips — mirrors constants/mockData.ts mockFashionTips
  await prisma.fashionTip.createMany({
    data: [
      {
        title: '2025 春夏流行色',
        description: '薄荷绿搭配米白，清爽又高级',
        sortOrder: 0,
        publishedAt: new Date(),
      },
      {
        title: '通勤穿搭法则',
        description: '上繁下简，轻松打造职场质感',
        sortOrder: 1,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed: cloud_plans, membership_benefits, fashion_tips');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
