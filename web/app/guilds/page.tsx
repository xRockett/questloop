
'use client';
import { useEffect, useState } from 'react';
import { jfetch } from '../lib/api';

export default function Guilds(){
  const [rows,setRows]=useState<any[]>([]);
  const [name,setName]=useState('');
  const [bio,setBio]=useState('');
  const [msg,setMsg]=useState<string|undefined>();
  useEffect(()=>{ (async()=>{ const d=await jfetch('/guilds'); setRows(d.guilds); })(); },[]);
  const create = async (e:any)=>{ e.preventDefault(); setMsg(undefined); try{ await jfetch('/guilds',{method:'POST',body:JSON.stringify({name,bio})}); location.reload(); }catch(err:any){ setMsg(err.message);} };
  const join = async (id:string)=>{ await jfetch(`/guilds/${id}/join`,{method:'POST'}); alert('Joined!'); };
  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-2">Guilds & Teams</h1>
        <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
          <input placeholder="Guild name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Short bio" value={bio} onChange={e=>setBio(e.target.value)} />
          <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Create</button>
        </form>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-3">Discover</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {rows.map(g=> (
            <div key={g.id} className="p-4 rounded-xl bg-white border">
              <div className="font-bold">{g.name}</div>
              <div className="text-sm text-gray-600">{g.bio}</div>
              <button onClick={()=>join(g.id)} className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white">Join</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
