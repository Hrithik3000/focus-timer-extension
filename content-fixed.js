class SiteBlocker {
  constructor() {
    this.isBlocked = false;
    this.overlay = null;
    this.checkAttempts = 0;
    this.maxCheckAttempts = 10;
    this.init();
  }
  
  init() {
    console.log('Site Blocker content script loaded on:', window.location.hostname);
    this.setupMessageListener();
    
    // Wait for DOM to be ready before checking if blocked
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.checkIfBlocked();
      });
    } else {
      this.checkIfBlocked();
    }
  }
  
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message);
      
      try {
        if (message.action === 'blockSite') {
          if (message.isBlocked && !this.isBlocked) {
            this.blockSite();
          } else if (!message.isBlocked && this.isBlocked) {
            this.unblockSite();
          }
          sendResponse({success: true});
        }
      } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({error: error.message});
      }
      
      return true;
    });
  }
  
  async checkIfBlocked() {
    this.checkAttempts++;
    
    try {
      const response = await chrome.runtime.sendMessage({action: 'getTimer'});
      
      if (response && response.isRunning && Array.isArray(response.blockedSites)) {
        const currentHost = window.location.hostname.replace(/^www\./, '').toLowerCase();
        const currentUrl = window.location.href.toLowerCase();
        
        const shouldBlock = response.blockedSites.some(site => {
          if (!site || typeof site !== 'string') return false;
          
          const cleanSite = site.toLowerCase().trim();
          
          return currentHost === cleanSite || 
                 currentHost.endsWith('.' + cleanSite) ||
                 currentHost.includes(cleanSite) ||
                 currentUrl.includes(cleanSite);
        });
        
        if (shouldBlock) {
          console.log('Site should be blocked:', currentHost);
          this.blockSite();
        } else {
          console.log('Site is not blocked:', currentHost);
        }
      }
    } catch (error) {
      console.log('Could not check if blocked (extension may be reloading):', error.message);
      
      // Retry a few times in case extension is initializing
      if (this.checkAttempts < this.maxCheckAttempts) {
        setTimeout(() => this.checkIfBlocked(), 1000);
      }
    }
  }
  
  blockSite() {
    if (this.isBlocked) return;
    
    console.log('Blocking site:', window.location.hostname);
    this.isBlocked = true;
    
    // Remove existing overlay if any
    this.removeOverlay();
    
    // Create new overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'focus-timer-overlay-' + Date.now(); // Unique ID to avoid conflicts
    this.overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 999999 !important;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
      text-align: center !important;
      padding: 20px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    `;
    
    this.overlay.innerHTML = `
      <div style="
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 20px !important;
        padding: 40px !important;
        backdrop-filter: blur(10px) !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        max-width: 500px !important;
        width: 100% !important;
        animation: fadeIn 0.5s ease-in !important;
      ">
        <div style="font-size: 80px !important; margin-bottom: 20px !important;">🎯</div>
        <h1 style="
          font-size: 36px !important;
          margin: 0 0 20px 0 !important;
          font-weight: 300 !important;
          color: white !important;
        ">Stay Focused!</h1>
        <p style="
          font-size: 18px !important;
          margin: 0 0 30px 0 !important;
          opacity: 0.9 !important;
          line-height: 1.5 !important;
          color: white !important;
        ">You're in a focus session right now. This site is temporarily blocked to help you concentrate on your goals.</p>
        <div style="
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 15px !important;
          padding: 20px !important;
          margin: 20px 0 !important;
        ">
          <p style="
            margin: 0 !important;
            font-size: 16px !important;
            opacity: 0.8 !important;
            color: white !important;
          ">💪 "Success is the sum of small efforts repeated day in and day out."</p>
        </div>
        <p style="
          font-size: 14px !important;
          margin: 0 !important;
          opacity: 0.7 !important;
          color: white !important;
        ">Click the Focus Timer extension to check your progress or take a break.</p>
        <div style="margin-top: 20px !important;">
          <small style="color: rgba(255,255,255,0.6) !important; font-size: 12px !important;">Blocked: ${window.location.hostname}</small>
        </div>
      </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    
    // Safely append to document
    this.safeAppend(this.overlay);
    this.safeAppend(style);
    
    // Prevent scrolling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Prevent clicks on underlying content
    this.overlay.addEventListener('click', (e) => e.stopPropagation());
  }
  
  safeAppend(element) {
    try {
      if (document.documentElement) {
        document.documentElement.appendChild(element);
      } else if (document.body) {
        document.body.appendChild(element);
      } else {
        // Wait for document to be ready
        setTimeout(() => this.safeAppend(element), 100);
      }
    } catch (error) {
      console.error('Error appending overlay:', error);
    }
  }
  
  removeOverlay() {
    if (this.overlay && this.overlay.parentNode) {
      try {
        this.overlay.parentNode.removeChild(this.overlay);
      } catch (error) {
        console.error('Error removing overlay:', error);
      }
    }
    
    // Also remove any other focus timer overlays (cleanup)
    const existingOverlays = document.querySelectorAll('[id^="focus-timer-overlay"]');
    existingOverlays.forEach(overlay => {
      try {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      } catch (error) {
        console.error('Error removing existing overlay:', error);
      }
    });
  }
  
  unblockSite() {
    if (!this.isBlocked) return;
    
    console.log('Unblocking site:', window.location.hostname);
    this.isBlocked = false;
    
    this.removeOverlay();
    
    // Restore scrolling
    try {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } catch (error) {
      console.error('Error restoring scroll:', error);
    }
  }
}

// Initialize with error handling
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SiteBlocker();
    });
  } else {
    new SiteBlocker();
  }
} catch (error) {
  console.error('Error initializing SiteBlocker:', error);
}