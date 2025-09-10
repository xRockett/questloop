
import { Router } from 'express';
import webpush from 'web-push';
import { z } from 'zod';
import { requireAuth } from '../util/auth.js';
import { prisma } from '../index.js';

const router = Router();

const pub = process.env.VAPID_PUBLIC_KEY || '';
const priv = process.env.VAPID_PRIVATE_KEY || '';
if (pub && priv) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:you@example.com', pub, priv);
}

router.get('/vapid', (_req, res) => res.json({ publicKey: pub }));

router.post('/subscribe', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({
    endpoint: z.string().url(),
    keys: z.object({ p256dh: z.string(), auth: z.string() })
  });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  await prisma.pushSubscription.upsert({
    where: { endpoint: parse.data.endpoint },
    update: { p256dh: parse.data.keys.p256dh, auth: parse.data.keys.auth, userId: req.user.id },
    create: { endpoint: parse.data.endpoint, p256dh: parse.data.keys.p256dh, auth: parse.data.keys.auth, userId: req.user.id }
  });
  res.json({ ok: true });
});

router.post('/send', requireAuth as any, async (req: any, res) => {
  if (!pub || !priv) return res.status(400).json({ error: 'VAPID not configured' });
  const subs = await prisma.pushSubscription.findMany({ where: { userId: req.user.id } });
  await Promise.all(subs.map(s => webpush.sendNotification({
    endpoint: s.endpoint,
    keys: { auth: s.auth, p256dh: s.p256dh }
  } as any, JSON.stringify({ title: 'QuestLoop', body: req.body?.body || 'Hello from QuestLoop!' })).catch(()=>null)));
  res.json({ ok: true });
});

export default router;
