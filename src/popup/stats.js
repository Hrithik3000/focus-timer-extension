// src/popup/stats.js
import { miniChart } from './charts.js';
export async function mountStats(root){
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `
  <h3 style="margin:0 0 8px 0">Stats</h3>
  <div class="kpi"><div class="box"><div>Today</div><div id="stToday">—</div></div>
  <div class="box"><div>Week</div><div id="stWeek">—</div></div>
  <div class="box"><div>Month</div><div id="stMonth">—</div></div></div>
  <canvas id="spark" width="300" height="60" style="margin-top:8px"></canvas>
  <div class="row"><button class="btn" id="csv">Export CSV</button></div>`;
  root.appendChild(card);
  const data = await read();
  document.getElementById('stToday').textContent = fmtMins(data.today);
  document.getElementById('stWeek').textContent = fmtMins(data.week);
  document.getElementById('stMonth').textContent = fmtMins(data.month);
  miniChart(document.getElementById('spark'), data.spark);
  document.getElementById('csv').onclick = async ()=>{
    const csv = await chrome.runtime.sendMessage({ type:'EXPORT_CSV' });
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='focus-history.csv'; a.click(); URL.revokeObjectURL(url);
  };
}
function fmtMins(s){ return Math.round(s/60)+' min'; }
async function read(){
  const todayKey = 'stats:'+new Date().toISOString().slice(0,10);
  const today = (await chrome.storage.local.get(todayKey))[todayKey]?.focusSeconds||0;
  // Simple placeholders; week/month aggregation will be enhanced later
  return { today, week: today, month: today, spark: [5,8,3,10,12,4,9] };
}
