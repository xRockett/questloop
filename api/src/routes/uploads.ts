
import { Router } from 'express';
import { requireAuth } from '../util/auth.js';
import { z } from 'zod';
import { presignUpload } from '../util/s3.js';
import { prisma } from '../index.js';

const router = Router();

router.post('/presign', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ type: z.enum(['avatar','banner']), contentType: z.string() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  const key = `${req.user.id}/${parse.data.type}.${parse.data.contentType.split('/')[1]||'bin'}`;
  const { url, publicUrl } = await presignUpload(key, parse.data.contentType);
  res.json({ url, publicUrl });
});

router.post('/apply', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ type: z.enum(['avatar','banner']), url: z.string().url() });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const data = parse.data.type === 'avatar' ? { avatarUrl: parse.data.url } : { bannerUrl: parse.data.url };
  const u = await prisma.user.update({ where: { id: req.user.id }, data });
  res.json({ user: u });
});

export default router;
