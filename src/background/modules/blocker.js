// src/background/modules/blocker.js
export class Blocker{
  constructor(){ this.list=[]; }
  setList(arr){ this.list = Array.isArray(arr)? arr.map(s=>s.toLowerCase()):[]; }
  shouldBlock(url){ try{ const u=new URL(url); const h=u.hostname.replace(/^www\./,'').toLowerCase(); return this.list.some(s => h===s || h.endsWith('.'+s) || h.includes(s)); }catch{ return false; } }
  async enforce(tabId, url, active){ if(active && this.shouldBlock(url)){ try{ await chrome.tabs.sendMessage(tabId, { type:'SITE_BLOCK', active:true }); }catch{} } }
}
