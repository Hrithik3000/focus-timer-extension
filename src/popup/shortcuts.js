// src/popup/shortcuts.js
export function registerShortcuts(){
  chrome.commands && chrome.commands.onCommand.addListener((cmd)=>{
    if(cmd==='start'){ chrome.runtime.sendMessage({ type:'TIMER_START', payload:{} }); }
    if(cmd==='pause'){ chrome.runtime.sendMessage({ type:'TIMER_PAUSE' }); }
    if(cmd==='reset'){ chrome.runtime.sendMessage({ type:'TIMER_RESET' }); }
  });
}
