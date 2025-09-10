
'use client';
import { useTheme } from '../lib/theme';
export default function ThemeSwitch(){
  const {theme,setTheme}=useTheme();
  const cycle = ()=> setTheme(theme==='pastel'?'midnight': theme==='midnight'?'ocean':'pastel');
  return <button onClick={cycle} className="theme-toggle">{theme} theme</button>;
}
