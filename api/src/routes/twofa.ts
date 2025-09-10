
import { Router } from 'express';
import { requireAuth } from '../util/auth.js';
import { prisma } from '../index.js';
import { authenticator } from 'otplib';
import { z } from 'zod';

const router = Router();

router.post('/setup', requireAuth as any, async (req: any, res) => {
  const secret = authenticator.generateSecret();
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const label = `QuestLoop:${user?.email}`;
  const issuer = 'QuestLoop';
  const otpauth = authenticator.keyuri(user?.email || req.user.id, issuer, secret);
  await prisma.twoFA.upsert({ where: { userId: req.user.id }, update: { secret }, create: { userId: req.user.id, secret } });
  res.json({ secret, otpauth });
});

router.post('/enable', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ token: z.string() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const rec = await prisma.twoFA.findUnique({ where: { userId: req.user.id } });
  if (!rec) return res.status(400).json({ error: 'Setup first' });
  const ok = authenticator.verify({ token: parse.data.token, secret: rec.secret });
  if (!ok) return res.status(400).json({ error: 'Invalid token' });
  await prisma.twoFA.update({ where: { userId: req.user.id }, data: { enabled: true } });
  res.json({ ok: true });
});

router.post('/verify', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ token: z.string() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const rec = await prisma.twoFA.findUnique({ where: { userId: req.user.id } });
  if (!rec || !rec.enabled) return res.status(400).json({ error: '2FA not enabled' });
  const ok = authenticator.verify({ token: parse.data.token, secret: rec.secret });
  if (!ok) return res.status(400).json({ error: 'Invalid token' });
  res.json({ ok: true });
});

export default router;
