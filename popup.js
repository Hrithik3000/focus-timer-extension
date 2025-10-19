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
    
    this.init();
  }
  
  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.updateDisplay();
    this.renderBlockedSites();
    this.updateTimerFromBackground();
  }
  
  async loadData() {
    try {
      const result = await chrome.storage.local.get(['focusTimer', 'blockedSites']);
      
      if (result.focusTimer) {
        this.currentTime = result.focusTimer.currentTime || 25 * 60;
        this.isRunning = result.focusTimer.isRunning || false;
      }
      
      this.blockedSites = result.blockedSites || [];
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
  
  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.startTimer());
    this.pauseBtn.addEventListener('click', () => this.pauseTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());
    
    document.querySelectorAll('.preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        this.setTimer(minutes * 60);
      });
    });
    
    this.addSiteBtn.addEventListener('click', () => this.addBlockedSite());
    
    this.siteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addBlockedSite();
      }
    });
  }
  
  async updateTimerFromBackground() {
    try {
      const response = await chrome.runtime.sendMessage({action: 'getTimer'});
      if (response && response.currentTime !== undefined) {
        this.currentTime = response.currentTime;
        this.isRunning = response.isRunning;
        this.updateDisplay();
      }
    } catch (error) {
      console.error('Error getting timer from background:', error);
    }
  }
  
  async startTimer() {
    if (this.currentTime <= 0) {
      this.currentTime = 25 * 60;
    }
    
    this.isRunning = true;
    this.updateDisplay();
    await this.saveData();
    
    try {
      await chrome.runtime.sendMessage({
        action: 'startTimer',
        currentTime: this.currentTime,
        blockedSites: this.blockedSites
      });
    } catch (error) {
      console.error('Error sending start message:', error);
    }
  }
  
  async pauseTimer() {
    this.isRunning = false;
    this.updateDisplay();
    await this.saveData();
    
    try {
      await chrome.runtime.sendMessage({action: 'pauseTimer'});
    } catch (error) {
      console.error('Error sending pause message:', error);
    }
  }
  
  async resetTimer() {
    this.currentTime = 25 * 60;
    this.isRunning = false;
    this.updateDisplay();
    await this.saveData();
    
    try {
      await chrome.runtime.sendMessage({action: 'resetTimer'});
    } catch (error) {
      console.error('Error sending reset message:', error);
    }
  }
  
  setTimer(seconds) {
    if (!this.isRunning) {
      this.currentTime = seconds;
      this.updateDisplay();
      this.saveData();
    }
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (this.isRunning) {
      this.status.textContent = '💪 Focusing... Stay strong!';
      this.startBtn.classList.add('active');
    } else if (this.currentTime === 0) {
      this.status.textContent = '🎉 Great job! Take a break!';
      this.startBtn.classList.remove('active');
    } else {
      this.status.textContent = 'Ready to focus!';
      this.startBtn.classList.remove('active');
    }
  }
  
  async addBlockedSite() {
    const site = this.siteInput.value.trim().toLowerCase();
    
    if (!site) return;
    
    const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    if (!this.blockedSites.includes(cleanSite)) {
      this.blockedSites.push(cleanSite);
      await this.saveData();
      this.renderBlockedSites();
      this.siteInput.value = '';
      
      try {
        await chrome.runtime.sendMessage({
          action: 'updateBlockedSites',
          blockedSites: this.blockedSites
        });
      } catch (error) {
        console.error('Error updating blocked sites:', error);
      }
    }
  }
  
  async removeSite(site) {
    const index = this.blockedSites.indexOf(site);
    if (index > -1) {
      this.blockedSites.splice(index, 1);
      await this.saveData();
      this.renderBlockedSites();
      
      try {
        await chrome.runtime.sendMessage({
          action: 'updateBlockedSites',
          blockedSites: this.blockedSites
        });
      } catch (error) {
        console.error('Error updating blocked sites:', error);
      }
    }
  }
  
  renderBlockedSites() {
    this.siteList.innerHTML = '';
    
    this.blockedSites.forEach(site => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      siteItem.innerHTML = `
        <span>${site}</span>
        <button class="remove-site" data-site="${site}">×</button>
      `;
      
      siteItem.querySelector('.remove-site').addEventListener('click', (e) => {
        this.removeSite(e.target.dataset.site);
      });
      
      this.siteList.appendChild(siteItem);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FocusTimer();
});