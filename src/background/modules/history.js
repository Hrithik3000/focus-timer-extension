// src/background/modules/history.js
export class History{
  async append(entry){
    const key = 'history';
    const h = (await chrome.storage.local.get(key))[key]||[];
    h.push({ t:Date.now(), ...entry });
    await chrome.storage.local.set({ [key]: h });
  }
  async csv(){
    const h = (await chrome.storage.local.get('history')).history||[];
    const hdr = 'timestamp,phase,seconds\n';
    const rows = h.map(x=>`${new Date(x.t).toISOString()},${x.phase},${x.seconds||0}`).join('\n');
    return hdr+rows+"\n";
  }
}
