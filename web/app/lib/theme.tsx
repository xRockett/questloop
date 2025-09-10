
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext<{theme:string,setTheme:(t:string)=>void}>({theme:'pastel',setTheme:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme] = useState('pastel');
  useEffect(()=>{ document.documentElement.dataset.theme = theme; },[theme]);
  return <ThemeCtx.Provider value={{theme,setTheme}}>{children}</ThemeCtx.Provider>;
}
export function useTheme(){ return useContext(ThemeCtx); }
