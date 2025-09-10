
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const pw = await argon2.hash('password123');
  const u1 = await prisma.user.upsert({
    where: { email: 'demo@questloop.local' },
    update: {},
    create: { email: 'demo@questloop.local', username: 'demo', passwordHash: pw, verifiedAt: new Date(), xp: 120, level: 2 }
  });
  await prisma.post.create({ data: { authorId: u1.id, content: 'Welcome to QuestLoop! 🎉' } });
  console.log('Seeded.');
}

main().then(()=> process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
