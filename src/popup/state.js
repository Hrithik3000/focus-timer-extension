// src/popup/state.js
export async function getState(){ return await chrome.runtime.sendMessage({ type:'GET_STATE' }); }
