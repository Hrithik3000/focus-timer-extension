// attach per-site settings (message/redirect/lock)
export async function saveSiteSettings(host, data){ const key='site:'+host; await chrome.storage.local.set({ [key]: data }); }
export async function getSiteSettings(host){ const key='site:'+host; return (await chrome.storage.local.get(key))[key]||{}; }
