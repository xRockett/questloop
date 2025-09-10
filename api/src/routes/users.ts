
import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

router.get('/leaderboard', async (_req, res) => {
  // past 30 days xp
  const since = new Date(Date.now() - 30*24*60*60*1000);
  const top = await prisma.user.findMany({
    orderBy: [{ xp: 'desc' }],
    take: 50,
    select: { id: true, username: true, avatarUrl: true, xp: true, level: true }
  });
  res.json({ top, since });
});

router.get('/:username', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user });
});

export default router;
