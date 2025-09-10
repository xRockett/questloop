
'use client';
import { useEffect, useState } from 'react';
import { jfetch } from '../lib/api';

export default function Leaderboard(){
  const [rows,setRows] = useState<any[]>([]);
  useEffect(()=>{ (async ()=>{ const data = await jfetch('/users/leaderboard'); setRows(data.top); })(); },[]);
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul className="grid gap-2">
        {rows.map((r,i)=> (
          <li key={r.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border">
            <span className="font-mono w-8">{i+1}.</span>
            <span className="font-semibold">@{r.username}</span>
            <span>Level {r.level}</span>
            <span className="font-mono">{r.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
