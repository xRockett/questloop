
import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../util/auth.js';
import { z } from 'zod';

const router = Router();

router.get('/seasons/current', async (_req, res) => {
  const now = new Date();
  const season = await prisma.season.findFirst({ where: { startsAt: { lte: now }, endsAt: { gte: now } } });
  res.json({ season });
});

router.post('/seasons', async (req, res) => {
  // simple adminless creator for demo
  const Schema = z.object({ name: z.string(), startsAt: z.string(), endsAt: z.string() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const s = await prisma.season.create({ data: { name: parse.data.name, startsAt: new Date(parse.data.startsAt), endsAt: new Date(parse.data.endsAt) } });
  res.json({ season: s });
});

router.get('/badges', async (_req, res) => {
  const badges = await prisma.badge.findMany();
  res.json({ badges });
});

router.post('/badges', async (req, res) => {
  const Schema = z.object({ code: z.string(), name: z.string(), description: z.string(), icon: z.string(), threshold: z.number().int() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const b = await prisma.badge.create({ data: parse.data });
  res.json({ badge: b });
});

router.get('/me/badges', requireAuth as any, async (req: any, res) => {
  const list = await prisma.userBadge.findMany({ where: { userId: req.user.id }, include: { badge: true } });
  res.json({ badges: list });
});

export default router;
