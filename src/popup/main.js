// src/popup/main.js
const $ = sel => document.querySelector(sel);
const fmt = s => { const m=Math.floor(s/60), x=s%60; return `${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`; };

async function getState(){ return await chrome.runtime.sendMessage({ type:'GET_STATE' }); }
async function setSettings(v){ return await chrome.runtime.sendMessage({ type:'SET_SETTINGS', payload:v }); }

function render(state){
  const root = $('#app');
  root.innerHTML = `
  <div class="app">
    <div class="card">
      <div class="timer" id="time">${fmt(state.timer?.remaining||1500)}</div>
      <div class="row">
        <button class="btn" id="start">Start</button>
        <button class="btn ghost" id="pause">Pause</button>
        <button class="btn ghost" id="reset">Reset</button>
      </div>
      <div class="row">
        <button class="btn ghost" data-phase="work">Work</button>
        <button class="btn ghost" data-phase="short">Short Break</button>
        <button class="btn ghost" data-phase="long">Long Break</button>
      </div>
      <div class="kpi">
        <div class="box"><div class="lbl">Today Focus</div><div id="kFocus">—</div></div>
        <div class="box"><div class="lbl">Sessions</div><div id="kSessions">—</div></div>
        <div class="box"><div class="lbl">Breaks</div><div id="kBreaks">—</div></div>
      </div>
    </div>
    <div class="card" style="margin-top:12px">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div style="font-weight:700">Blocked sites</div>
        <span class="badge" id="mode">overlay</span>
      </div>
      <div class="row" style="margin:8px 0">
        <input id="site" placeholder="e.g. youtube.com" style="flex:1; padding:10px; border-radius:10px; border:1px solid #e5e7eb" />
        <button class="btn" id="add">Add</button>
      </div>
      <div class="list" id="sites"></div>
    </div>
  </div>`;
}

async function load(){
  const state = await getState();
  render(state);
  $('#start').onclick = async ()=> chrome.runtime.sendMessage({ type:'TIMER_START', payload:{} });
  $('#pause').onclick = async ()=> chrome.runtime.sendMessage({ type:'TIMER_PAUSE' });
  $('#reset').onclick = async ()=> chrome.runtime.sendMessage({ type:'TIMER_RESET' });
  document.querySelectorAll('[data-phase]').forEach(b=> b.onclick=()=> chrome.runtime.sendMessage({ type:'TIMER_START', payload:{ phase:b.dataset.phase } }));
  $('#add').onclick = async ()=>{ const v=$('#site').value.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,''); if(!v) return; const r = await chrome.storage.local.get('blockedSites'); const list = r.blockedSites||[]; if(!list.includes(v)) list.push(v); await chrome.storage.local.set({ blockedSites:list }); await chrome.runtime.sendMessage({ type:'BLOCKLIST_UPDATE', payload:list }); drawSites(); };
  setInterval(async ()=>{ const s = await getState(); $('#time').textContent = fmt(s.timer.remaining); }, 1000);
  drawSites();
}

async function drawSites(){ const r = await chrome.storage.local.get('blockedSites'); const list = r.blockedSites||[]; const el = document.getElementById('sites'); el.innerHTML = list.map(s=>`<div class="row" style="justify-content:space-between"><div>${s}</div><button class="btn ghost" data-rm="${s}">Remove</button></div>`).join(''); el.querySelectorAll('[data-rm]').forEach(b=> b.onclick=async ()=>{ const v=b.dataset.rm; const rr = await chrome.storage.local.get('blockedSites'); const arr=(rr.blockedSites||[]).filter(x=>x!==v); await chrome.storage.local.set({ blockedSites:arr }); await chrome.runtime.sendMessage({ type:'BLOCKLIST_UPDATE', payload:arr }); drawSites(); }); }

document.addEventListener('DOMContentLoaded', load);
