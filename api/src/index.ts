
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import uploadsRouter from './routes/uploads.js';
import guildsRouter from './routes/guilds.js';
import metaRouter from './routes/meta.js';
import twofaRouter from './routes/twofa.js';
import pushRouter from './routes/push.js';
import { requireAuthSocket } from './util/auth.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true, credentials: true }
});

export const prisma = new PrismaClient();
export const ws = io;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadsRouter);
app.use('/guilds', guildsRouter);
app.use('/meta', metaRouter);
app.use('/2fa', twofaRouter);
app.use('/push', pushRouter);

io.use(requireAuthSocket).on('connection', (socket) => {
  console.log('socket connected', socket.data.user?.id);
});

const PORT = process.env.PORT || 4000;

// --- Admin auto-provision on boot ---
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !username || !password) return;
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  const argon2 = (await import('argon2')).default;
  const hash = await argon2.hash(password);
  if (!existing) {
    await prisma.user.create({ data: { email, username, passwordHash: hash, verifiedAt: new Date(), role: 'admin', xp: 1000, level: 5 } });
    console.log('[BOOT] Admin created:', email);
  } else {
    if (existing.role !== 'admin') await prisma.user.update({ where: { id: existing.id }, data: { role: 'admin', verifiedAt: existing.verifiedAt || new Date() } });
    console.log('[BOOT] Admin ensured:', email);
  }
}
ensureAdmin().catch(console.error);

httpServer.listen(PORT, () => console.log(`API listening on :${PORT}`));
