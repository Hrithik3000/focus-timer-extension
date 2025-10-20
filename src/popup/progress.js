// src/popup/progress.js
export function mountRing(host, seconds, total){
  host.innerHTML = '';
  const ring = document.createElement('div'); ring.className='ring';
  const R=90, C=2*Math.PI*R; const pct = Math.max(0,Math.min(1, seconds/total));
  ring.innerHTML = `
  <svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="90" stroke="#e5e7eb" stroke-width="12" fill="none"/>
    <circle cx="100" cy="100" r="90" stroke="#22c55e" stroke-width="12" fill="none" stroke-linecap="round"
      stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" transform="rotate(-90 100 100)"/>
  </svg>
  <div class="value" id="ringVal"></div>`;
  host.appendChild(ring);
  return (secLeft)=>{ const p = Math.max(0, Math.min(1, secLeft/total)); ring.querySelector('circle[stroke="#22c55e"]').setAttribute('stroke-dashoffset', String(C*(1-p))); };
}
