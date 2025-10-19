class FocusTimerBackground {
  constructor() {
    this.currentTime = 25 * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.blockedSites = [];
    this.init();
  }
  
  init() {
    this.setupMessageListeners();
    this.loadData();
  }
  
  async loadData() {
    try {
      const result = await chrome.storage.local.get(['focusTimer', 'blockedSites']);
      
      if (result.focusTimer) {
        this.currentTime = result.focusTimer.currentTime || 25 * 60;
        this.isRunning = result.focusTimer.isRunning || false;
      }
      
      this.blockedSites = result.blockedSites || [];
      
      if (this.isRunning) {
        this.startTimer();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  async saveData() {
    try {
      await chrome.storage.local.set({
        focusTimer: {
          currentTime: this.currentTime,
          isRunning: this.isRunning
        },
        blockedSites: this.blockedSites
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
  
  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'startTimer':
          this.currentTime = message.currentTime;
          this.blockedSites = message.blockedSites || [];
          this.startTimer();
          sendResponse({success: true});
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
          this.blockedSites = message.blockedSites || [];
          this.saveData();
          sendResponse({success: true});
          break;
          
        default:
          sendResponse({error: 'Unknown action'});
      }
      
      return true;
    });
  }
  
  startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.isRunning = true;
    this.updateBadge();
    
    this.intervalId = setInterval(() => {
      this.currentTime--;
      this.updateBadge();
      this.saveData();
      
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
  }
  
  async completeTimer() {
    this.pauseTimer();
    this.currentTime = 0;
    
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Focus Timer Complete! 🎉',
      message: 'Great job! You\'ve completed your focus session. Time for a well-deserved break!'
    });
    
    this.updateBadge();
    this.saveData();
  }
  
  updateBadge() {
    const minutes = Math.floor(this.currentTime / 60);
    const badgeText = this.isRunning ? minutes.toString() : '';
    
    chrome.action.setBadgeText({text: badgeText});
    chrome.action.setBadgeBackgroundColor({color: this.isRunning ? '#FF6B6B' : '#4ECDC4'});
  }
  
  isBlocked(url) {
    if (!this.isRunning || this.blockedSites.length === 0) {
      return false;
    }
    
    const hostname = this.extractHostname(url);
    
    return this.blockedSites.some(site => {
      const cleanSite = site.toLowerCase();
      const cleanHostname = hostname.toLowerCase();
      
      return cleanHostname === cleanSite || 
             cleanHostname.endsWith('.' + cleanSite) ||
             cleanHostname.includes(cleanSite);
    });
  }
  
  extractHostname(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      return url;
    }
  }
}

const focusTimer = new FocusTimerBackground();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (focusTimer.isBlocked(tab.url)) {
      chrome.tabs.sendMessage(tabId, {
        action: 'blockSite',
        isBlocked: true
      }).catch(() => {});
    }
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && focusTimer.isBlocked(tab.url)) {
      chrome.tabs.sendMessage(activeInfo.tabId, {
        action: 'blockSite',
        isBlocked: true
      }).catch(() => {});
    }
  } catch (error) {
    console.error('Error checking active tab:', error);
  }
});