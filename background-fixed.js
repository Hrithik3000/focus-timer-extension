class FocusTimerBackground {
  constructor() {
    this.currentTime = 25 * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.blockedSites = [];
    this.lastSaveTime = Date.now();
    this.init();
  }
  
  init() {
    console.log('Focus Timer Background initializing...');
    this.setupMessageListeners();
    this.loadData();
    this.setupInstallHandler();
  }
  
  setupInstallHandler() {
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Focus Timer installed:', details.reason);
      if (details.reason === 'install') {
        this.resetTimer();
      }
    });
  }
  
  async loadData() {
    try {
      const result = await chrome.storage.local.get(['focusTimer', 'blockedSites']);
      
      if (result.focusTimer) {
        this.currentTime = Math.max(0, result.focusTimer.currentTime || 25 * 60);
        this.isRunning = Boolean(result.focusTimer.isRunning);
        
        // Check if data is stale (more than 5 minutes old)
        const lastUpdated = result.focusTimer.lastUpdated || 0;
        const timeSinceUpdate = Date.now() - lastUpdated;
        if (this.isRunning && timeSinceUpdate > 5 * 60 * 1000) {
          console.log('Timer data is stale, resetting');
          this.isRunning = false;
        }
      }
      
      this.blockedSites = Array.isArray(result.blockedSites) ? result.blockedSites : [];
      
      // Resume timer if it was running
      if (this.isRunning && this.currentTime > 0) {
        console.log('Resuming timer from background');
        this.startTimer();
      } else {
        this.updateBadge();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.resetTimer();
    }
  }
  
  async saveData() {
    try {
      // Throttle saves to avoid too many storage calls
      const now = Date.now();
      if (now - this.lastSaveTime < 1000) return; // Don't save more than once per second
      
      await chrome.storage.local.set({
        focusTimer: {
          currentTime: this.currentTime,
          isRunning: this.isRunning,
          lastUpdated: now
        },
        blockedSites: this.blockedSites
      });
      
      this.lastSaveTime = now;
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
  
  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Background received message:', message.action);
      
      try {
        switch (message.action) {
          case 'startTimer':
            if (typeof message.currentTime === 'number' && message.currentTime > 0) {
              this.currentTime = message.currentTime;
            }
            if (Array.isArray(message.blockedSites)) {
              this.blockedSites = message.blockedSites;
            }
            this.startTimer();
            sendResponse({success: true, currentTime: this.currentTime});
            break;
            
          case 'pauseTimer':
            this.pauseTimer();
            sendResponse({success: true});
            break;
            
          case 'resetTimer':
            this.resetTimer();
            sendResponse({success: true});
            break;
            
          case 'getTimer':
            sendResponse({
              currentTime: this.currentTime,
              isRunning: this.isRunning,
              blockedSites: this.blockedSites
            });
            break;
            
          case 'updateBlockedSites':
            if (Array.isArray(message.blockedSites)) {
              this.blockedSites = message.blockedSites;
              this.saveData();
              sendResponse({success: true});
            } else {
              sendResponse({error: 'Invalid blocked sites data'});
            }
            break;
            
          default:
            sendResponse({error: 'Unknown action: ' + message.action});
        }
      } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({error: error.message});
      }
      
      return true; // Keep message channel open for async response
    });
  }
  
  startTimer() {
    // Clear any existing timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Don't start if time is already 0 or negative
    if (this.currentTime <= 0) {
      this.completeTimer();
      return;
    }
    
    this.isRunning = true;
    this.updateBadge();
    this.saveData();
    
    console.log('Timer started with', this.currentTime, 'seconds');
    
    this.intervalId = setInterval(() => {
      this.currentTime = Math.max(0, this.currentTime - 1);
      this.updateBadge();
      
      // Save every 10 seconds to reduce storage calls
      if (this.currentTime % 10 === 0) {
        this.saveData();
      }
      
      if (this.currentTime <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }
  
  pauseTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    this.updateBadge();
    this.saveData();
    
    console.log('Timer paused at', this.currentTime, 'seconds');
  }
  
  resetTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.currentTime = 25 * 60;
    this.isRunning = false;
    this.updateBadge();
    this.saveData();
    
    console.log('Timer reset to', this.currentTime, 'seconds');
  }
  
  async completeTimer() {
    console.log('Timer completed!');
    this.pauseTimer();
    this.currentTime = 0;
    
    try {
      // Show notification
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Focus Timer Complete! 🎉',
        message: 'Great job! You\'ve completed your focus session. Time for a well-deserved break!'
      });
    } catch (error) {
      console.log('Could not show notification:', error);
      // Try showing without icon if icon fails
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: '', // Empty icon
          title: 'Focus Timer Complete! 🎉',
          message: 'Great job! You\'ve completed your focus session. Time for a well-deserved break!'
        });
      } catch (error2) {
        console.error('Notification failed completely:', error2);
      }
    }
    
    this.updateBadge();
    this.saveData();
  }
  
  updateBadge() {
    try {
      const minutes = Math.floor(this.currentTime / 60);
      const badgeText = this.isRunning && minutes > 0 ? minutes.toString() : '';
      
      chrome.action.setBadgeText({text: badgeText});
      chrome.action.setBadgeBackgroundColor({
        color: this.isRunning ? '#FF6B6B' : '#4ECDC4'
      });
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  }
  
  isBlocked(url) {
    if (!this.isRunning || this.blockedSites.length === 0 || !url) {
      return false;
    }
    
    try {
      const hostname = this.extractHostname(url);
      
      return this.blockedSites.some(site => {
        if (!site || typeof site !== 'string') return false;
        
        const cleanSite = site.toLowerCase().trim();
        const cleanHostname = hostname.toLowerCase();
        
        return cleanHostname === cleanSite || 
               cleanHostname.endsWith('.' + cleanSite) ||
               cleanHostname.includes(cleanSite);
      });
    } catch (error) {
      console.error('Error checking if blocked:', error);
      return false;
    }
  }
  
  extractHostname(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      // Fallback for invalid URLs
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  }
  
  // Safe message sending to content scripts
  async sendMessageToTab(tabId, message) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      // Ignore errors for tabs that don't have content script
      console.log('Could not send message to tab', tabId, ':', error.message);
    }
  }
}

// Initialize the background timer
const focusTimer = new FocusTimerBackground();

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (focusTimer.isBlocked(tab.url)) {
      focusTimer.sendMessageToTab(tabId, {
        action: 'blockSite',
        isBlocked: true
      });
    }
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && focusTimer.isBlocked(tab.url)) {
      focusTimer.sendMessageToTab(activeInfo.tabId, {
        action: 'blockSite',
        isBlocked: true
      });
    }
  } catch (error) {
    console.log('Error checking active tab:', error.message);
  }
});