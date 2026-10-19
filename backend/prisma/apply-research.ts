import { PrismaClient } from '@prisma/client';
import { tipResearch } from './data/tip-research';

// 이미 더 최근에 조사된 값(AI 갱신 결과 등)은 덮어쓰지 않습니다.
export async function applyResearch(prisma: PrismaClient) {
  let applied = 0;
  for (const r of tipResearch) {
    const restaurant = await prisma.restaurant.findFirst({ where: { name: r.name } });
    if (!restaurant) continue;
    const checkedAt = new Date(r.checkedAt);
    if (restaurant.tipCheckedAt && restaurant.tipCheckedAt >= checkedAt) continue;
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        tipPolicy: r.tipPolicy,
        tipConfidence: r.confidence,
        tipEvidence: JSON.stringify(r.evidence),
        tipCheckedAt: checkedAt,
        ...(r.businessStatus ? { businessStatus: r.businessStatus } : {})
      }
    });
    applied++;
  }
  return applied;
}

if (require.main === module) {
  const prisma = new PrismaClient();
  applyResearch(prisma)
    .then((n) => console.log(`팁 조사 결과 적용: ${n}곳`))
    .finally(() => prisma.$disconnect());
}
