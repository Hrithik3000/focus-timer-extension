// storage sync utility
export async function getSync(key, fallback){ const r = await chrome.storage.sync.get(key); return r[key] ?? fallback; }
export async function setSync(obj){ return await chrome.storage.sync.set(obj); }
