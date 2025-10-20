// Hook new tabs (Settings/Stats) into popup main
import { registerShortcuts } from './shortcuts.js';
import { mountSettings } from './settings.js';
import { mountStats } from './stats.js';

// Extend existing load() rendering
const origLoad = window.load;
window.load = async function(){
  await origLoad?.();
  const app = document.querySelector('#app');
  const tabs = document.createElement('div');
  tabs.className='row';
  tabs.innerHTML = `
    <button class="btn ghost" id="tabTimer">Timer</button>
    <button class="btn ghost" id="tabStats">Stats</button>
    <button class="btn ghost" id="tabSettings">Settings</button>`;
  app.prepend(tabs);
  const container = document.createElement('div'); container.id='subview'; app.appendChild(container);
  document.getElementById('tabStats').onclick = ()=>{ container.innerHTML=''; mountStats(container); };
  document.getElementById('tabSettings').onclick = ()=>{ container.innerHTML=''; mountSettings(container); };
  registerShortcuts();
};
