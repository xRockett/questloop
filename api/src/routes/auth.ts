
import { Router } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';
import argon2 from 'argon2';
import { sendVerification } from '../util/email.js';
import { signToken, requireAuth } from '../util/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const Schema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8).max(100)
  });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const { email, username, password } = parse.data;
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) return res.status(409).json({ error: 'Email or username already in use' });

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({ data: { email, username, passwordHash } });

  const code = Math.floor(100000 + Math.random()*900000).toString();
  const expires = new Date(Date.now() + 15*60*1000);
  await prisma.verificationCode.create({ data: { userId: user.id, code, expiresAt: expires } });

  try { await sendVerification(email, code); } catch (e) { console.error(e); }
  return res.json({ ok: true, userId: user.id });
});

router.post('/verify', async (req, res) => {
  const Schema = z.object({ userId: z.string(), code: z.string().length(6) });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const { userId, code } = parse.data;
  const rec = await prisma.verificationCode.findFirst({
    where: { userId, code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });
  if (!rec) return res.status(400).json({ error: 'Invalid or expired code' });

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { verifiedAt: new Date() } }),
    prisma.verificationCode.update({ where: { id: rec.id }, data: { usedAt: new Date() } })
  ]);

  return res.json({ ok: true });
});

router.post('/login', async (req, res) => {
  const Schema = z.object({ emailOrUsername: z.string(), password: z.string() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const { emailOrUsername, password } = parse.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] }
  });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.verifiedAt) return res.status(403).json({ error: 'Account not verified' });

  const ok = await (await import('argon2')).default.verify(user.passwordHash, password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = signToken({ id: user.id, email: user.email, username: user.username });
  res.cookie('qljwt', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('qljwt');
  res.json({ ok: true });
});

router.get('/me', requireAuth as any, async (req: any, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user: me });
});

export default router;
