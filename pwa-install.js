/**
 * PWA Install Handler - طواجن فوش
 * Manages app installation detection, prompts, and standalone mode
 */

class PWAInstallManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.dismissedTime = null;
    this.DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    this.SHOW_DELAY = 3000; // 3 seconds after page load
    
    this.init();
  }

  init() {
    this.checkInstallationStatus();
    this.setupBeforeInstallPrompt();
    this.setupAppInstalled();
    this.setupDisplayModeStandalone();
    this.injectInstallUI();
    this.registerServiceWorker();
  }

  /**
   * Check if app is already installed
   */
  checkInstallationStatus() {
    // Check standalone mode (iOS)
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('[PWA] App running in standalone mode (iOS)');
      return;
    }

    // Check if running as PWA (Android)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('[PWA] App running in standalone mode (Android/Web)');
      return;
    }

    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      this.dismissedTime = parseInt(dismissed);
      const now = Date.now();
      if (now - this.dismissedTime < this.DISMISS_DURATION) {
        console.log('[PWA] Install prompt dismissed, will show again later');
      } else {
        localStorage.removeItem('pwa_install_dismissed');
      }
    }
  }

  /**
   * Listen for beforeinstallprompt event (Chrome, Edge, Samsung)
   */
  setupBeforeInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] beforeinstallprompt fired');
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Show prompt after delay
      setTimeout(() => {
        if (!this.isInstalled) {
          this.showInstallPrompt();
          this.showFloatingButton();
        }
      }, this.SHOW_DELAY);
    });
  }

  /**
   * Listen for app installed event
   */
  setupAppInstalled() {
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App successfully installed!');
      this.isInstalled = true;
      this.hideInstallUI();
      this.showToast('تم تثبيت التطبيق بنجاح! 🎉', 'success');
      
      // Analytics
      if (window.gtag) {
        gtag('event', 'app_installed');
      }
    });
  }

  /**
   * Handle standalone display mode
   */
  setupDisplayModeStandalone() {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        console.log('[PWA] App switched to standalone mode');
        this.isInstalled = true;
        this.hideInstallUI();
        this.optimizeStandaloneUI();
      }
    });

    // Check on load
    if (mediaQuery.matches) {
      this.optimizeStandaloneUI();
    }
  }

  /**
   * Optimize UI when running as standalone app
   */
  optimizeStandaloneUI() {
    // Hide browser-specific UI hints
    document.body.style.overscrollBehavior = 'none';
    
    // Ensure status bar is styled
    const metaStatusBar = document.querySelector('meta[name="theme-color"]');
    if (metaStatusBar) {
      metaStatusBar.setAttribute('content', '#fbbf24');
    }

    console.log('[PWA] Standalone UI optimized');
  }

  /**
   * Show modal install prompt
   */
  showInstallPrompt() {
    // Don't show if already dismissed recently
    if (this.dismissedTime && Date.now() - this.dismissedTime < this.DISMISS_DURATION) {
      return;
    }

    if (!this.deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return;
    }

    const modal = document.getElementById('pwa-install-modal');
    if (!modal) {
      console.error('[PWA] Install modal not found in DOM');
      return;
    }

    // Show modal
    modal.classList.add('visible');
    modal.style.display = 'flex';

    // Button actions
    const installBtn = modal.querySelector('.pwa-modal-install-btn');
    const cancelBtn = modal.querySelector('.pwa-modal-cancel-btn');

    if (installBtn) {
      installBtn.addEventListener('click', () => this.promptInstall(), { once: true });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.dismissPrompt(), { once: true });
    }

    console.log('[PWA] Install prompt modal shown');
  }

  /**
   * Show floating install button
   */
  showFloatingButton() {
    const button = document.getElementById('pwa-floating-install-btn');
    if (!button) {
      console.error('[PWA] Floating install button not found');
      return;
    }

    button.style.display = 'flex';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.promptInstall();
    });

    console.log('[PWA] Floating install button shown');
  }

  /**
   * Trigger browser install prompt
   */
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      this.showToast('التطبيق متوفر بالفعل', 'info');
      return;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
        this.showToast('جاري تثبيت التطبيق...', 'info');
      } else {
        console.log('[PWA] User dismissed install prompt');
        this.dismissPrompt();
      }

      this.deferredPrompt = null;
      this.hideInstallUI();
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      this.showToast('حدث خطأ في التثبيت', 'error');
    }
  }

  /**
   * Dismiss install prompt and hide UI
   */
  dismissPrompt() {
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    this.dismissedTime = Date.now();
    this.hideInstallUI();
    console.log('[PWA] Install prompt dismissed');
  }

  /**
   * Hide all install UI elements
   */
  hideInstallUI() {
    const modal = document.getElementById('pwa-install-modal');
    const button = document.getElementById('pwa-floating-install-btn');

    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }

    if (button) {
      button.style.display = 'none';
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.className = `toast toast-${type}`;
      toast.style.display = 'block';
      
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }
  }

  /**
   * Inject HTML UI elements into DOM
   */
  injectInstallUI() {
    // Check if UI already exists
    if (document.getElementById('pwa-install-modal')) {
      return;
    }

    // Create modal
    const modalHTML = `
      <div id="pwa-install-modal" class="pwa-overlay">
        <div class="pwa-modal">
          <div class="pwa-modal-header">
            <h3>📱 تثبيت التطبيق</h3>
            <button class="pwa-modal-close" onclick="document.getElementById('pwa-install-modal').style.display='none'">&times;</button>
          </div>
          
          <div class="pwa-modal-content">
            <div class="pwa-modal-logo">
              <img src="./logo.png" alt="طواجن فوش">
            </div>
            
            <h4>طواجن فوش - نظام إدارة المطعم</h4>
            <p>ثبّت التطبيق على جهازك للعمل بسهولة أكثر!</p>
            
            <div class="pwa-benefits">
              <div class="pwa-benefit-item">
                <i class="fas fa-bolt"></i>
                <span>تحميل أسرع</span>
              </div>
              <div class="pwa-benefit-item">
                <i class="fas fa-mobile-alt"></i>
                <span>تطبيق حقيقي</span>
              </div>
              <div class="pwa-benefit-item">
                <i class="fas fa-wifi"></i>
                <span>يعمل بلا انترنت</span>
              </div>
              <div class="pwa-benefit-item">
                <i class="fas fa-shield-alt"></i>
                <span>آمن وموثوق</span>
              </div>
            </div>
          </div>
          
          <div class="pwa-modal-actions">
            <button class="pwa-modal-install-btn btn-install">
              <i class="fas fa-download"></i> تثبيت الآن
            </button>
            <button class="pwa-modal-cancel-btn btn-cancel">
              <i class="fas fa-times"></i> الآن لا
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Create floating button
    const floatingHTML = `
      <button id="pwa-floating-install-btn" class="pwa-floating-btn" title="تثبيت التطبيق">
        <i class="fas fa-download"></i>
        <span>تثبيت</span>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', floatingHTML);

    console.log('[PWA] Install UI injected into DOM');
  }

  /**
   * Register service worker
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Every 60 seconds

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New SW version available');
                  this.showToast('تحديث جديد متوفر في الخلفية، سيتم تطبيقه في الزيارة القادمة', 'info');
                  // We do NOT forcefully skip waiting and reload the page anymore 
                  // to avoid interrupting the user while they are making orders.
                }
              });
            });
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      });

      // Handle SW controller change (we keep this in case the user manually reloads)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service Worker controller changed');
      });
    }
  }
}

// Initialize PWA Install Manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAInstallManager();
  });
} else {
  window.pwaManager = new PWAInstallManager();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAInstallManager;
}
