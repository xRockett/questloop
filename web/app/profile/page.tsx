
'use client';
import { useState } from 'react';
import { jfetch } from '../lib/api';

async function uploadPresigned(file: File, type:'avatar'|'banner'){
  const { url, publicUrl } = await jfetch('/uploads/presign',{ method:'POST', body: JSON.stringify({ type, contentType: file.type })});
  await fetch(url, { method:'PUT', body: file, headers: { 'Content-Type': file.type } });
  await jfetch('/uploads/apply',{ method:'POST', body: JSON.stringify({ type, url: publicUrl })});
  return publicUrl;
}

export default function Profile(){
  const [avatar,setAvatar] = useState<string>('');
  const [banner,setBanner] = useState<string>('');
  const [msg,setMsg] = useState<string|undefined>();

  const onPick = async (e:any, kind:'avatar'|'banner')=>{
    const file = e.target.files?.[0]; if(!file) return;
    setMsg('Uploading...');
    try{
      const url = await uploadPresigned(file, kind);
      kind==='avatar'? setAvatar(url) : setBanner(url);
      setMsg('Saved!');
    }catch(err:any){ setMsg(err.message); }
  };

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label>Avatar</label>
            <input type="file" accept="image/*" onChange={(e)=>onPick(e,'avatar')} />
            {avatar && <img src={avatar} alt="avatar" className="mt-2 w-24 h-24 rounded-full object-cover" />}
          </div>
          <div>
            <label>Banner</label>
            <input type="file" accept="image/*" onChange={(e)=>onPick(e,'banner')} />
            {banner && <img src={banner} alt="banner" className="mt-2 w-full h-32 object-cover rounded-xl" />}
          </div>
        </div>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>
    </div>
  )
}
