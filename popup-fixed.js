class FocusTimer {
  constructor() {
    this.timerDisplay = document.getElementById('timerDisplay');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.status = document.getElementById('status');
    this.siteInput = document.getElementById('siteInput');
    this.addSiteBtn = document.getElementById('addSiteBtn');
    this.siteList = document.getElementById('siteList');
    
    this.currentTime = 25 * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.blockedSites = [];
    this.syncIntervalId = null;
    
    this.init();
  }
  
  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.updateDisplay();
      this.renderBlockedSites();
      await this.updateTimerFromBackground();
      
      // Start sync with background every 2 seconds
      this.startSync();
    } catch (error) {
      console.error('Error initializing popup:', error);
      this.showError('Failed to initialize. Please reload the extension.');
    }
  }
  
  startSync() {
    // Clear existing sync
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
    
    // Sync with background every 2 seconds
    this.syncIntervalId = setInterval(async () => {
      try {
        await this.updateTimerFromBackground();
      } catch (error) {
        console.log('Sync error (normal if extension reloaded):', error);
      }
    }, 2000);
  }
  
  showError(message) {
    if (this.status) {
      this.status.textContent = '❌ ' + message;
      this.status.style.color = '#ff6b6b';
    }
  }
  
  async loadData() {
    try {
      const result = await chrome.storage.local.get(['focusTimer', 'blockedSites']);
      
      if (result.focusTimer) {
        this.currentTime = Math.max(0, result.focusTimer.currentTime || 25 * 60);
        this.isRunning = Boolean(result.focusTimer.isRunning);
      }
      
      this.blockedSites = Array.isArray(result.blockedSites) ? result.blockedSites : [];
    } catch (error) {
      console.error('Error loading data:', error);
      // Use defaults on error
      this.currentTime = 25 * 60;
      this.isRunning = false;
      this.blockedSites = [];
    }
  }
  
  async saveData() {
    try {
      await chrome.storage.local.set({
        focusTimer: {
          currentTime: this.currentTime,
          isRunning: this.isRunning,
          lastUpdated: Date.now()
        },
        blockedSites: this.blockedSites
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
  
  setupEventListeners() {
    // Button listeners
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startTimer());
    }
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.pauseTimer());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetTimer());
    }
    
    // Preset buttons
    document.querySelectorAll('.preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        if (!isNaN(minutes)) {
          this.setTimer(minutes * 60);
        }
      });
    });
    
    // Site management
    if (this.addSiteBtn) {
      this.addSiteBtn.addEventListener('click', () => this.addBlockedSite());
    }
    
    if (this.siteInput) {
      this.siteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBlockedSite();
        }
      });
    }
    
    // Cleanup when popup closes
    window.addEventListener('beforeunload', () => {
      if (this.syncIntervalId) {
        clearInterval(this.syncIntervalId);
      }
    });
  }
  
  async updateTimerFromBackground() {
    try {
      const response = await this.sendMessageSafe({action: 'getTimer'});
      if (response && response.currentTime !== undefined) {
        this.currentTime = Math.max(0, response.currentTime);
        this.isRunning = Boolean(response.isRunning);
        this.blockedSites = Array.isArray(response.blockedSites) ? response.blockedSites : this.blockedSites;
        this.updateDisplay();
      }
    } catch (error) {
      console.log('Could not sync with background (normal if extension just reloaded):', error);
    }
  }
  
  async sendMessageSafe(message) {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      if (error.message?.includes('Extension context invalidated')) {
        this.showError('Extension needs reload. Please refresh the page.');
      }
      throw error;
    }
  }
  
  async startTimer() {
    try {
      if (this.currentTime <= 0) {
        this.currentTime = 25 * 60;
      }
      
      this.isRunning = true;
      this.updateDisplay();
      await this.saveData();
      
      await this.sendMessageSafe({
        action: 'startTimer',
        currentTime: this.currentTime,
        blockedSites: this.blockedSites
      });
      
      if (this.status) {
        this.status.style.color = 'white';
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      this.showError('Failed to start timer');
      this.isRunning = false;
      this.updateDisplay();
    }
  }
  
  async pauseTimer() {
    try {
      this.isRunning = false;
      this.updateDisplay();
      await this.saveData();
      
      await this.sendMessageSafe({action: 'pauseTimer'});
      
      if (this.status) {
        this.status.style.color = 'white';
      }
    } catch (error) {
      console.error('Error pausing timer:', error);
      this.showError('Failed to pause timer');
    }
  }
  
  async resetTimer() {
    try {
      this.currentTime = 25 * 60;
      this.isRunning = false;
      this.updateDisplay();
      await this.saveData();
      
      await this.sendMessageSafe({action: 'resetTimer'});
      
      if (this.status) {
        this.status.style.color = 'white';
      }
    } catch (error) {
      console.error('Error resetting timer:', error);
      this.showError('Failed to reset timer');
    }
  }
  
  setTimer(seconds) {
    if (!this.isRunning && seconds > 0) {
      this.currentTime = seconds;
      this.updateDisplay();
      this.saveData();
    }
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    
    if (this.timerDisplay) {
      this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (this.status) {
      if (this.isRunning) {
        this.status.textContent = '💪 Focusing... Stay strong!';
        this.startBtn?.classList.add('active');
      } else if (this.currentTime === 0) {
        this.status.textContent = '🎉 Great job! Take a break!';
        this.startBtn?.classList.remove('active');
      } else {
        this.status.textContent = 'Ready to focus!';
        this.startBtn?.classList.remove('active');
      }
    }
  }
  
  async addBlockedSite() {
    try {
      const site = this.siteInput?.value?.trim()?.toLowerCase();
      
      if (!site) return;
      
      // Clean the site URL
      const cleanSite = site
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
        .trim();
      
      if (!cleanSite || this.blockedSites.includes(cleanSite)) {
        return;
      }
      
      this.blockedSites.push(cleanSite);
      await this.saveData();
      this.renderBlockedSites();
      
      if (this.siteInput) {
        this.siteInput.value = '';
      }
      
      await this.sendMessageSafe({
        action: 'updateBlockedSites',
        blockedSites: this.blockedSites
      });
    } catch (error) {
      console.error('Error adding blocked site:', error);
      this.showError('Failed to add site');
    }
  }
  
  async removeSite(site) {
    try {
      const index = this.blockedSites.indexOf(site);
      if (index > -1) {
        this.blockedSites.splice(index, 1);
        await this.saveData();
        this.renderBlockedSites();
        
        await this.sendMessageSafe({
          action: 'updateBlockedSites',
          blockedSites: this.blockedSites
        });
      }
    } catch (error) {
      console.error('Error removing blocked site:', error);
      this.showError('Failed to remove site');
    }
  }
  
  renderBlockedSites() {
    if (!this.siteList) return;
    
    this.siteList.innerHTML = '';
    
    this.blockedSites.forEach(site => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      
      const siteSpan = document.createElement('span');
      siteSpan.textContent = site;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-site';
      removeBtn.textContent = '×';
      removeBtn.dataset.site = site;
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeSite(e.target.dataset.site);
      });
      
      siteItem.appendChild(siteSpan);
      siteItem.appendChild(removeBtn);
      this.siteList.appendChild(siteItem);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FocusTimer();
  });
} else {
  new FocusTimer();
}