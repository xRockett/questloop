
export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export async function jfetch(path: string, opts: any = {}) {
  const res = await fetch(API + path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
