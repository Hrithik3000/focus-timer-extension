// src/popup/settings.js
import { getState } from './state.js';
export function mountSettings(root){
  const el = document.createElement('div');
  el.className='card';
  el.innerHTML = `
  <h3 style="margin:0 0 8px 0">Settings</h3>
  <div class="row" style="justify-content:space-between"><div>Theme</div>
    <select id="themeSel">
      <option value="warm">Warm</option>
      <option value="dark">Dark</option>
      <option value="minimal">Minimal</option>
      <option value="system">System</option>
    </select>
  </div>
  <div class="row" style="justify-content:space-between"><div>Auto start next</div>
    <input type="checkbox" id="autoNext" />
  </div>
  <div class="row" style="justify-content:space-between"><div>Storage</div>
    <select id="storageSel"><option value="local">Local</option><option value="sync">Sync</option></select>
  </div>
  <div class="row" style="justify-content:space-between"><div>Sound volume</div>
    <input type="range" min="0" max="100" id="volume" />
  </div>`;
  root.appendChild(el);
  init();
  async function init(){
    const s = (await getState()).settings;
    el.querySelector('#themeSel').value = s.theme||'warm';
    el.querySelector('#autoNext').checked = !!s.autoStartNext;
    el.querySelector('#storageSel').value = (s.storage||'local');
    el.querySelector('#volume').value = s.volume ?? 70;
    el.addEventListener('change', async ()=>{
      const upd = {
        ...s,
        theme: el.querySelector('#themeSel').value,
        autoStartNext: el.querySelector('#autoNext').checked,
        storage: el.querySelector('#storageSel').value,
        volume: Number(el.querySelector('#volume').value)
      };
      await chrome.runtime.sendMessage({ type:'SET_SETTINGS', payload:upd });
    });
  }
}
