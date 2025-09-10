
'use client';
import { useEffect, useState } from 'react';
import { jfetch } from '../lib/api';
import io from 'socket.io-client';

import { motion } from 'framer-motion';
export default function Feed() {
  const [posts,setPosts] = useState<any[]>([]);
  const [content,setContent] = useState('');
  useEffect(()=>{ load(); },[]);
  async function load(){ const data = await jfetch('/posts'); setPosts(data.posts); }
  async function create(e:any){ e.preventDefault(); await jfetch('/posts',{ method:'POST', body: JSON.stringify({ content })}); setContent(''); await load(); }
  async function like(id:string){ await jfetch(`/posts/${id}/like`,{ method:'POST'}); }
  async function unlike(id:string){ await jfetch(`/posts/${id}/unlike`,{ method:'POST'}); }
  useEffect(()=>{
    const token = document.cookie.split('; ').find(s=>s.startsWith('qljwt='))?.split('=')[1];
    const socket = io(process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000',{ auth:{ token } });
    socket.on('post_like', (payload:any)=>{
      setPosts(p=>p.map(x=> x.id===payload.postId? {...x, likeCount: payload.likeCount}: x));
    });
    return ()=>{ socket.close(); };
  },[]);
  return (
    <div className="grid gap-4">
      <form onSubmit={create} className="card p-5">
        <textarea placeholder="Share something inspiring..." value={content} onChange={e=>setContent(e.target.value)} />
        <div className="text-right"><button className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 text-white">Post</button></div>
      </form>
      {posts.map(p=> (
        <motion.article key={p.id} className="card p-5" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{type:'spring', stiffness:120}}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-300 to-amber-200" />
            <div>
              <div className="font-semibold">{p.author.username}</div>
              <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <p className="mb-3 whitespace-pre-wrap">{p.content}</p>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={()=>like(p.id)} className="px-3 py-1 rounded-lg bg-white border">❤️ {p.likeCount}</button>
            <button onClick={()=>unlike(p.id)} className="px-3 py-1 rounded-lg">Undo</button>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
