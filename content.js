class SiteBlocker {
  constructor() {
    this.isBlocked = false;
    this.overlay = null;
    this.init();
  }
  
  init() {
    this.setupMessageListener();
    this.checkIfBlocked();
  }
  
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'blockSite') {
        if (message.isBlocked && !this.isBlocked) {
          this.blockSite();
        } else if (!message.isBlocked && this.isBlocked) {
          this.unblockSite();
        }
      }
    });
  }
  
  async checkIfBlocked() {
    try {
      const response = await chrome.runtime.sendMessage({action: 'getTimer'});
      if (response && response.isRunning && response.blockedSites) {
        const currentHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
        const shouldBlock = response.blockedSites.some(site => {
          const cleanSite = site.toLowerCase();
          return currentHost === cleanSite || 
                 currentHost.endsWith('.' + cleanSite) ||
                 currentHost.includes(cleanSite);
        });
        
        if (shouldBlock) {
          this.blockSite();
        }
      }
    } catch (error) {
      console.error('Error checking if blocked:', error);
    }
  }
  
  blockSite() {
    if (this.isBlocked) return;
    
    this.isBlocked = true;
    
    this.overlay = document.createElement('div');
    this.overlay.id = 'focus-timer-overlay';
    this.overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          max-width: 500px;
          width: 100%;
        ">
          <div style="font-size: 80px; margin-bottom: 20px;">🎯</div>
          <h1 style="
            font-size: 36px;
            margin: 0 0 20px 0;
            font-weight: 300;
          ">Stay Focused!</h1>
          <p style="
            font-size: 18px;
            margin: 0 0 30px 0;
            opacity: 0.9;
            line-height: 1.5;
          ">You're in a focus session right now. This site is temporarily blocked to help you concentrate on your goals.</p>
          <div style="
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
          ">
            <p style="
              margin: 0;
              font-size: 16px;
              opacity: 0.8;
            ">💪 "Success is the sum of small efforts repeated day in and day out."</p>
          </div>
          <p style="
            font-size: 14px;
            margin: 0;
            opacity: 0.7;
          ">Click the Focus Timer extension to check your progress or take a break.</p>
        </div>
      </div>
    `;
    
    document.documentElement.appendChild(this.overlay);
    
    document.body.style.overflow = 'hidden';
  }
  
  unblockSite() {
    if (!this.isBlocked) return;
    
    this.isBlocked = false;
    
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    document.body.style.overflow = '';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SiteBlocker();
  });
} else {
  new SiteBlocker();
}