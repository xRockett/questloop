
'use client';
import { useEffect, useState } from 'react';
import { jfetch } from '../lib/api';
import { motion } from 'framer-motion';

export default function Badges(){
  const [all,setAll]=useState<any[]>([]);
  const [mine,setMine]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const a=await jfetch('/meta/badges'); setAll(a.badges);
    const m=await jfetch('/meta/me/badges'); setMine(m.badges);
  })(); },[]);
  const mineIds = new Set(mine.map((x:any)=>x.badgeId));
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-3">Achievements</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {all.map((b:any)=>{
          const owned = mineIds.has(b.id);
          return (
            <motion.div key={b.id} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring'}} className={"p-4 rounded-xl border " + (owned?"bg-white":"bg-gray-50 opacity-70")}>
              <div className="text-3xl">{b.icon}</div>
              <div className="font-semibold">{b.name}</div>
              <div className="text-sm text-gray-600">{b.description}</div>
              {owned ? <div className="mt-2 text-green-600 font-medium">Unlocked</div> : <div className="mt-2 text-gray-500">Unlock at {b.threshold} XP</div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
