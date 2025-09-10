
import { prisma } from '../index.js';

export async function addXp(userId: string, amount: number, type: string) {
  await prisma.$transaction(async (tx) => {
    await tx.xpEvent.create({ data: { userId, amount, type } });
    const user = await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: amount } }
    });
    // level every 100 xp
    const newLevel = Math.max(1, Math.floor(user.xp / 100) + 1);
    if (newLevel !== user.level) {
      await tx.user.update({ where: { id: userId }, data: { level: newLevel } });
    }
  });
}
