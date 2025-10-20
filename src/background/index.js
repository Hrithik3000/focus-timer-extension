// src/background/index.js
// Module entry: orchestrates timers, analytics, sync, sounds, themes
import { TimerManager } from './modules/timer.js';
import { Blocker } from './modules/blocker.js';
import { Analytics } from './modules/analytics.js';
import { Sync } from './modules/sync.js';
import { Notifier } from './modules/notify.js';

const state = {
  version: '2.0.0',
  settings: {
    workMinutes: 25,
    shortBreak: 5,
    longBreak: 15,
    cyclesBeforeLongBreak: 4,
    autoStartNext: true,
    theme: 'warm',
    sound: 'chime',
    blockMode: 'overlay', // overlay | redirect
    redirectUrl: 'chrome://newtab/',
    customMessage: 'Stay focused — your goals > distractions.'
  }
};

const timer = new TimerManager();
const blocker = new Blocker();
const analytics = new Analytics();
const sync = new Sync();
const notify = new Notifier();

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['settings']);
  if (!existing.settings) await chrome.storage.local.set({ settings: state.settings });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    switch (msg.type) {
      case 'TIMER_START':
        await timer.start(msg.payload);
        analytics.mark('session_start', msg.payload);
        sendResponse({ ok: true });
        break;
      case 'TIMER_PAUSE':
        timer.pause();
        analytics.mark('session_pause');
        sendResponse({ ok: true });
        break;
      case 'TIMER_RESET':
        timer.reset();
        sendResponse({ ok: true });
        break;
      case 'GET_STATE':
        sendResponse({
          timer: timer.snapshot(),
          settings: await chrome.storage.local.get('settings').then(r => r.settings)
        });
        break;
      case 'SET_SETTINGS':
        await chrome.storage.local.set({ settings: msg.payload });
        sendResponse({ ok: true });
        break;
      case 'BLOCKLIST_UPDATE':
        blocker.setList(msg.payload);
        await chrome.storage.local.set({ blockedSites: msg.payload });
        sendResponse({ ok: true });
        break;
      default:
        sendResponse({ ok: false, error: 'unknown' });
    }
  })();
  return true;
});

// Tab enforcement
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete' && tab.url && timer.isFocus()) {
    blocker.enforce(tabId, tab.url, timer.isFocus());
  }
});
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url && timer.isFocus()) blocker.enforce(tabId, tab.url, true);
});

// Session lifecycle
timer.on('tick', () => chrome.action.setBadgeText({ text: String(Math.max(0, Math.floor(timer.remaining()/60))) }));
timer.on('complete', async (phase) => {
  analytics.mark('session_complete', { phase });
  await notify.done(phase);
  if (await timer.autoStartNext()) timer.startNext();
});
