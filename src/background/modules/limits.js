// src/background/modules/limits.js
export class Limits{
  async canVisit(host){
    const key='limits:'+host; const lim=(await chrome.storage.local.get(key))[key];
    if(!lim || !lim.perDay) return true;
    const today=new Date().toISOString().slice(0,10);
    const used=((await chrome.storage.local.get('usage:'+host))["usage:"+host]||{})[today]||0;
    return used < lim.perDay*60; // compare seconds
  }
  async addUsage(host, seconds){
    const key='usage:'+host; const map=(await chrome.storage.local.get(key))[key]||{}; const day=new Date().toISOString().slice(0,10);
    map[day]=(map[day]||0)+seconds; await chrome.storage.local.set({ [key]:map });
  }
}
