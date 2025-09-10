
import { Router } from 'express';
import { prisma, ws } from '../index.js';
import { requireAuth } from '../util/auth.js';
import { z } from 'zod';
import { addXp } from '../util/xp.js';
import { isToxic } from '../util/moderation.js';

const router = Router();

router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true, comments: true }
  });
  res.json({ posts });
});


router.post('/', requireAuth as any, async (req: any, res) => {

  const Schema = z.object({ content: z.string().min(1).max(500) });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());

  
  if (isToxic(parse.data.content)) return res.status(400).json({ error: 'Message refused by moderation' });

  const post = await prisma.post.create({

    data: { authorId: req.user.id, content: parse.data.content }
  });
  
  await addXp(req.user.id, 10, 'POST');
  // award badges at xp milestones
  const u = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (u) {
    const milestones = [100, 500, 1000];
    for (const m of milestones) {
      if (u.xp >= m) {
        const badge = await prisma.badge.findFirst({ where: { threshold: m } });
        if (badge) {
          const has = await prisma.userBadge.findFirst({ where: { userId: u.id, badgeId: badge.id } });
          if (!has) await prisma.userBadge.create({ data: { userId: u.id, badgeId: badge.id } });
        }
      }
    }
  }
  res.json({ post });

});

router.post('/:id/like', requireAuth as any, async (req: any, res) => {
  const id = req.params.id;
  try {
    await prisma.like.create({ data: { postId: id, userId: req.user.id } });
    const post = await prisma.post.update({ where: { id }, data: { likeCount: { increment: 1 } } });
    ws.emit('post_like', { postId: id, likeCount: post.likeCount });
    await addXp(req.user.id, 2, 'LIKE');
    res.json({ ok: true, likeCount: post.likeCount });
  } catch {
    res.status(400).json({ error: 'Already liked or invalid' });
  }
});

router.post('/:id/unlike', requireAuth as any, async (req: any, res) => {
  const id = req.params.id;
  try {
    await prisma.like.delete({ where: { postId_userId: { postId: id, userId: req.user.id } } });
    const post = await prisma.post.update({ where: { id }, data: { likeCount: { decrement: 1 } } });
    ws.emit('post_like', { postId: id, likeCount: post.likeCount });
    res.json({ ok: true, likeCount: post.likeCount });
  } catch {
    res.status(400).json({ error: 'Not liked yet' });
  }
});

router.post('/:id/comment', requireAuth as any, async (req: any, res) => {
  const Schema = z.object({ content: z.string().min(1).max(300) });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const id = req.params.id;

  const comment = await prisma.comment.create({
    data: { postId: id, authorId: req.user.id, content: parse.data.content }
  });
  await addXp(req.user.id, 5, 'COMMENT');
  res.json({ comment });
});

export default router;
