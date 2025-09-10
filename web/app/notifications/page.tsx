
'use client';
import { useEffect, useState } from 'react';
import { jfetch } from '../lib/api';

export default function Notifications(){
  const [status,setStatus]=useState<string>('');
  async function subscribe(){
    setStatus('Requesting permission...');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { setStatus('Permission denied'); return; }
    const { publicKey } = await jfetch('/push/vapid');
    const reg = await navigator.serviceWorker.register('/sw.js');
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
    await jfetch('/push/subscribe',{ method:'POST', body: JSON.stringify(sub) });
    setStatus('Subscribed! You can now receive notifications.');
  }
  const send = async ()=>{ await jfetch('/push/send',{ method:'POST', body: JSON.stringify({ body: 'Test notification!' })}); alert('Sent!'); };
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-3">Push Notifications</h1>
      <button onClick={subscribe} className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Enable push</button>
      <button onClick={send} className="ml-3 px-5 py-3 rounded-xl bg-white border">Send test</button>
      <p className="mt-2 text-sm">{status}</p>
    </div>
  )
}

function urlBase64ToUint8Array(base64String:string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
  return outputArray;
}
