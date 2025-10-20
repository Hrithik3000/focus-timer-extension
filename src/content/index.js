// src/content/index.js
(function(){
  let overlay=null; function show(msg){ if(overlay){overlay.remove();}
    overlay=document.createElement('div'); overlay.style.cssText='position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#f6d365 0%,#fda085 100%);display:flex;align-items:center;justify-content:center;color:#1f1f1f;font-family:system-ui,Segoe UI,Roboto,sans-serif;';
    overlay.innerHTML = `<div style="background:rgba(255,255,255,.85);padding:32px 28px;border-radius:16px;max-width:540px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.15)">
      <div style="font-size:64px;">🎯</div>
      <h2 style="margin:8px 0 12px 0;font-weight:700">Stay Focused</h2>
      <p style="margin:0 0 16px 0;opacity:.8">${msg||'This site is blocked during focus time.'}</p>
      <small style="opacity:.6">Manage block list in the extension</small>
    </div>`; document.documentElement.appendChild(overlay); }
  function hide(){ overlay&&overlay.remove(); overlay=null; }
  chrome.runtime.onMessage.addListener((m)=>{ if(m.type==='SITE_BLOCK'){ m.active? show() : hide(); } });
})();
