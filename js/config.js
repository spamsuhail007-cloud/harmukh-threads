/* ============================================================
   CONFIG — Gateway settings, merchant credentials & YouPI SDK loader
   Harmukh Threads × YouPI PG
   ============================================================ */

window.HT_CONFIG = (() => {
  const STORAGE_KEY = 'ht_youpi_config';

  const defaults = {
    // Port 7000: YouPI PG Customer Portal & youpi.js host
    // Port 6100: YouPI PG Payment REST Core API
    gatewayUrl: 'http://localhost:7000',
    apiUrl: 'http://localhost:6100',
    merchantKey: '00000000-0000-0000-0000-000000000001',
    merchantName: 'Harmukh Threads',
    merchantVpa: 'sofisuhail007@ibl',
    currency: 'INR',
    whatsappOtpEnabled: true,
    codEnabled: false, // Strict: COD is completely disabled
    simulationMode: false,
    upiAccounts: [
      { id: 'acc_1', upiId: 'sofisuhail007@ibl', payeeName: 'Harmukh Threads', isActive: true }
    ]
  };

  // Load persisted overrides from localStorage if present
  let current = { ...defaults };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      current = { ...current, ...JSON.parse(saved) };
      // Ensure COD stays disabled even if old config had it true
      current.codEnabled = false;
    }
  } catch (e) {
    console.warn('[HT_CONFIG] Failed reading storage config', e);
  }

  function get() {
    return { ...current };
  }

  function update(partial) {
    current = { ...current, ...partial, codEnabled: false };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('[HT_CONFIG] Failed persisting storage config', e);
    }
  }

  function setVpa(newUpiId, payeeName = 'Harmukh Threads') {
    const trimmed = (newUpiId || '').trim();
    if (!trimmed) return false;

    current.merchantVpa = trimmed;
    current.merchantName = payeeName;

    // Update in upiAccounts list or add if not present
    let found = false;
    current.upiAccounts = (current.upiAccounts || []).map(acc => {
      if (acc.upiId.toLowerCase() === trimmed.toLowerCase()) {
        found = true;
        return { ...acc, payeeName, isActive: true };
      }
      return { ...acc, isActive: false };
    });

    if (!found) {
      current.upiAccounts.push({
        id: 'acc_' + Date.now(),
        upiId: trimmed,
        payeeName,
        isActive: true
      });
    }

    update({
      merchantVpa: trimmed,
      merchantName: payeeName,
      upiAccounts: current.upiAccounts
    });
    return true;
  }

  function activateAccount(accId) {
    const target = (current.upiAccounts || []).find(a => a.id === accId);
    if (!target) return false;

    current.upiAccounts.forEach(a => {
      a.isActive = (a.id === accId);
    });
    current.merchantVpa = target.upiId;
    current.merchantName = target.payeeName || 'Harmukh Threads';
    update({
      merchantVpa: target.upiId,
      merchantName: target.payeeName,
      upiAccounts: current.upiAccounts
    });
    return true;
  }

  function removeAccount(accId) {
    if ((current.upiAccounts || []).length <= 1) return false; // Don't remove last one
    current.upiAccounts = current.upiAccounts.filter(a => a.id !== accId);
    if (!current.upiAccounts.some(a => a.isActive)) {
      current.upiAccounts[0].isActive = true;
      current.merchantVpa = current.upiAccounts[0].upiId;
    }
    update({ upiAccounts: current.upiAccounts, merchantVpa: current.merchantVpa });
    return true;
  }

  function reset() {
    current = { ...defaults };
    localStorage.removeItem(STORAGE_KEY);
  }

  // Dynamically load the YouPI PG universal client SDK (youpi.js)
  let sdkLoadPromise = null;
  function loadSdk() {
    if (sdkLoadPromise) return sdkLoadPromise;

    sdkLoadPromise = new Promise((resolve, reject) => {
      if (window.Youpi && typeof window.Youpi.pay === 'function') {
        return resolve(window.Youpi);
      }

      const existingScript = document.getElementById('youpi-pg-sdk');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.Youpi));
        existingScript.addEventListener('error', () => reject(new Error('Failed loading youpi.js')));
        return;
      }

      const script = document.createElement('script');
      script.id = 'youpi-pg-sdk';
      script.src = `${current.gatewayUrl}/youpi.js`;
      script.setAttribute('data-youpi-key', current.merchantKey);
      script.setAttribute('data-currency', current.currency);
      script.async = true;

      script.onload = () => {
        console.log('[YouPI SDK] Loaded successfully from', current.gatewayUrl);
        resolve(window.Youpi);
      };

      script.onerror = () => {
        console.warn(`[YouPI SDK] Could not reach gateway at ${current.gatewayUrl}. Gateway server may be offline.`);
        reject(new Error(`YouPI Gateway at ${current.gatewayUrl} is unreachable.`));
      };

      document.head.appendChild(script);
    });

    return sdkLoadPromise;
  }

  return {
    get,
    update,
    setVpa,
    activateAccount,
    removeAccount,
    reset,
    loadSdk
  };
})();
