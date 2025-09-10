
import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../util/auth.js';
import { z } from 'zod';

const router = Router();

router.get('/', async (_req, res) => {
  const guilds = await prisma.guild.findMany({ include: { _count: { select: { members: true } } } });
  res.json({ guilds });
});

router.post('/', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ name: z.string().min(3), bio: z.string().max(200).optional() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const g = await prisma.guild.create({ data: { name: parse.data.name, bio: parse.data.bio||'', ownerId: req.user.id } });
  await prisma.guildMember.create({ data: { userId: req.user.id, guildId: g.id, role: 'owner' } });
  res.json({ guild: g });
});

router.post('/:id/join', requireAuth as any, async (req: any, res) => {
  const id = req.params.id;
  await prisma.guildMember.create({ data: { userId: req.user.id, guildId: id } });
  res.json({ ok: true });
});

router.get('/:id', async (req, res) => {
  const g = await prisma.guild.findUnique({ where: { id: req.params.id }, include: { members: { include: { user: true } } } });
  if (!g) return res.status(404).json({ error: 'Not found' });
  res.json({ guild: g });
});

export default router;
