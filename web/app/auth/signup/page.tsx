
'use client';
import { useState } from 'react';
import { jfetch } from '../../lib/api';

export default function Signup() {
  const [email,setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [userId,setUserId] = useState<string|undefined>();
  const [code,setCode] = useState('');
  const [step,setStep] = useState<'form'|'verify'>('form');
  const [msg,setMsg] = useState<string|undefined>();

  const submit = async (e:any)=>{
    e.preventDefault();
    setMsg(undefined);
    try{
      const res = await jfetch('/auth/register',{ method:'POST', body: JSON.stringify({ email, username, password })});
      setUserId(res.userId);
      setStep('verify');
      setMsg('Verification code sent! Check Mailpit (http://localhost:8025) in dev.');
    }catch(err:any){ setMsg(err.message); }
  };

  const verify = async (e:any)=>{
    e.preventDefault();
    setMsg(undefined);
    try{
      await jfetch('/auth/verify',{ method:'POST', body: JSON.stringify({ userId, code })});
      setMsg('Verified! You can now log in.');
    }catch(err:any){ setMsg(err.message); }
  };

  return (
    <div className="max-w-md mx-auto card p-8">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      {step==='form' && <form onSubmit={submit} className="grid gap-3">
        <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} required type="email"/></div>
        <div><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)} required/></div>
        <div><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} required type="password"/></div>
        <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Sign up</button>
      </form>}
      {step==='verify' && <form onSubmit={verify} className="grid gap-3">
        <div><label>Verification code</label><input value={code} onChange={e=>setCode(e.target.value)} required/></div>
        <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Verify</button>
      </form>}
      {msg && <p className="text-sm text-gray-700 mt-3">{msg}</p>}
    </div>
  )
}
