// src/popup/charts.js
export function miniChart(canvas, data){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height; ctx.clearRect(0,0,w,h);
  const max = Math.max(1,...data); const step = w/(data.length-1);
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth=2; ctx.beginPath();
  data.forEach((v,i)=>{ const x=i*step; const y=h - (v/max)*h; i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
  ctx.stroke();
}
