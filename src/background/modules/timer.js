// src/background/modules/timer.js
export class TimerManager {
  constructor(){
    this._remaining = 25*60; this._phase = 'work'; this._cycles=0; this._tick=null; this._listeners={};
  }
  on(evt, cb){ (this._listeners[evt] ||= []).push(cb); }
  _emit(evt, data){ (this._listeners[evt]||[]).forEach(fn=>{try{fn(data)}catch(e){}}); }
  async _settings(){ const r = await chrome.storage.local.get('settings'); return r.settings; }
  snapshot(){ return { remaining:this._remaining, phase:this._phase, cycles:this._cycles, running:!!this._tick }; }
  isFocus(){ return this._phase==='work' && !!this._tick; }
  remaining(){ return this._remaining; }
  async start(payload){
    const s = await this._settings();
    if(payload?.phase) this._phase = payload.phase;
    this._remaining = (payload?.seconds) || (this._phase==='work'? s.workMinutes*60 : (this._phase==='short'? s.shortBreak*60 : s.longBreak*60));
    this._tick && clearInterval(this._tick);
    this._tick = setInterval(()=>{ this._remaining=Math.max(0,this._remaining-1); this._emit('tick'); if(this._remaining===0){ this.pause(); this._emit('complete', this._phase); } },1000);
  }
  pause(){ if(this._tick){ clearInterval(this._tick); this._tick=null; this._emit('tick'); } }
  reset(){ this.pause(); this._remaining = 25*60; this._phase='work'; this._cycles=0; this._emit('tick'); }
  async autoStartNext(){ const s = await this._settings(); return !!s.autoStartNext; }
  async startNext(){
    if(this._phase==='work'){ this._cycles++; const s = await this._settings(); this._phase = (this._cycles % s.cyclesBeforeLongBreak===0)? 'long':'short'; }
    else { this._phase='work'; }
    await this.start({ phase:this._phase });
  }
}
