// src/background/modules/analytics.js
export class Analytics{
  async mark(event, payload={}){
    const today = new Date().toISOString().slice(0,10);
    const key = 'stats:'+today;
    const cur = (await chrome.storage.local.get(key))[key] || { focusSeconds:0, sessions:0, breaks:0, events:[] };
    if(event==='session_complete'){
      if(payload.phase==='work') cur.sessions++; else cur.breaks++;
    }
    cur.events.push({ t:Date.now(), event, ...payload });
    await chrome.storage.local.set({ [key]:cur });
  }
}
