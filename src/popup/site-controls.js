// src/popup/site-controls.js
import { saveSiteSettings, getSiteSettings } from '../background/modules/site-settings.js';
export async function mountSiteControls(root, host){
  const data = await getSiteSettings(host);
  const el=document.createElement('div'); el.className='card';
  el.innerHTML=`<h3>Per-site</h3>
  <div class="row" style="justify-content:space-between"><div>Message</div><input id="msg" value="${(data.message||'Stay focused.')}"></div>
  <div class="row" style="justify-content:space-between"><div>Redirect URL</div><input id="redir" placeholder="chrome://newtab/" value="${(data.redirectUrl||'')}"></div>
  <div class="row" style="justify-content:space-between"><div>Lock during focus</div><input type="checkbox" id="lock" ${data.lock?'checked':''}></div>
  <div class="row"><button class="btn" id="save">Save</button></div>`;
  root.appendChild(el);
  el.querySelector('#save').onclick = async ()=>{
    await saveSiteSettings(host, {
      message: el.querySelector('#msg').value,
      redirectUrl: el.querySelector('#redir').value,
      lock: el.querySelector('#lock').checked
    });
  };
}
