
'use client';
import { useState } from 'react';
import { jfetch } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [id,setId] = useState('');
  const [password,setPassword] = useState('');
  const [msg,setMsg] = useState<string|undefined>();
  const router = useRouter();
  const submit = async (e:any)=>{
    e.preventDefault();
    setMsg(undefined);
    try{
      await jfetch('/auth/login',{ method:'POST', body: JSON.stringify({ emailOrUsername: id, password })});
      router.push('/feed');
    }catch(err:any){ setMsg(err.message); }
  };
  return (
    <div className="max-w-md mx-auto card p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
      <form onSubmit={submit} className="grid gap-3">
        <div><label>Email ou nom d'utilisateur</label><input value={id} onChange={e=>setId(e.target.value)} required/></div>
        <div><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Log in</button>
      </form>
      {msg && <p className="text-sm text-gray-700 mt-3">{msg}</p>}
    </div>
  )
}
