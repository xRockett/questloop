
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type JwtUser = { id: string, email: string, username: string };

export function signToken(user: JwtUser) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(user, secret, { expiresIn: '7d' });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['qljwt'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    // @ts-ignore
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAuthSocket(socket: any, next: any) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('no token'));
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    socket.data.user = payload;
    next();
  } catch (e) {
    next(e);
  }
}
