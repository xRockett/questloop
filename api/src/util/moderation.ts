
const banned = ['hate','kill yourself','suicide','nazi','racial slur','idiot']; // demo list
export function isToxic(text: string): boolean {
  const t = text.toLowerCase();
  return banned.some(w => t.includes(w));
}
