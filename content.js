/**
 * Hide Roblox Offsale Passes - Content Script
 * Detects offsale passes and provides toggle UI with persistence
 */

(function () {
  'use strict';

  const BUTTON_ID = 'hide-offsale-toggle-button';
  const OFFSALE_TEXT = 'Offsale';
  const HIDDEN_CLASS = 'offsale-hidden-by-extension';
  const STORAGE_KEY = 'hide-offsale-passes-enabled';

  /**
   * Find all pass rows in the table
   */
  function getPassRows() {
    return document.querySelectorAll('tbody tr');
  }

  /**
   * Check if a row is an offsale pass
   */
  function isOffsaleRow(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return false;

    // Look for "Offsale" text in the row
    for (let cell of cells) {
      if (cell.textContent.includes(OFFSALE_TEXT)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hide/show a row
   */
  function hideRow(row, hide = true) {
    if (hide) {
      row.style.display = 'none';
      row.classList.add(HIDDEN_CLASS);
    } else {
      row.style.display = '';
      row.classList.remove(HIDDEN_CLASS);
    }
  }

  /**
   * Check if hiding is enabled in localStorage
   */
  function isHidingEnabled() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  /**
   * Set hiding state in localStorage
   */
  function setHidingEnabled(enabled) {
    localStorage.setItem(STORAGE_KEY, enabled.toString());
  }

  /**
   * Hide all offsale passes
   */
  function hideAllOffsale() {
    const rows = getPassRows();
    let hidCount = 0;

    rows.forEach((row) => {
      if (isOffsaleRow(row)) {
        hideRow(row, true);
        hidCount++;
      }
    });

    console.log(`[Hide Offsale] Hidden ${hidCount} offsale passes`);
    return hidCount;
  }

  /**
   * Show all offsale passes
   */
  function showAllOffsale() {
    const rows = getPassRows();
    let showedCount = 0;

    rows.forEach((row) => {
      const isHiddenRow = row.classList.contains(HIDDEN_CLASS) || row.style.display === 'none';
      if (isOffsaleRow(row) && isHiddenRow) {
        hideRow(row, false);
        showedCount++;
      }
    });

    console.log(`[Hide Offsale] Showed ${showedCount} offsale passes`);
    return showedCount;
  }

  /**
   * Apply current state (hide or show based on localStorage)
   */
  function applyCurrentState() {
    if (isHidingEnabled()) {
      hideAllOffsale();
    } else {
      showAllOffsale();
    }
  }

  /**
   * Update button appearance and text
   */
  function updateButtonAppearance(button) {
    const isHidden = isHidingEnabled();

    if (isHidden) {
      button.textContent = 'Show';
      button.className = 'hide-offsale-toggle-button hide-offsale-toggle-button-show';
    } else {
      button.textContent = 'Hide';
      button.className = 'hide-offsale-toggle-button hide-offsale-toggle-button-hide';
    }
  }

  /**
   * Handle toggle button click
   */
  function handleToggleClick() {
    const currentlyHidden = isHidingEnabled();
    const newState = !currentlyHidden;

    setHidingEnabled(newState);

    if (newState) {
      const hidCount = hideAllOffsale();
      alert(`Hidden ${hidCount} offsale pass${hidCount !== 1 ? 'es' : ''}`);
    } else {
      const showedCount = showAllOffsale();
      alert(`Showing ${showedCount} offsale pass${showedCount !== 1 ? 'es' : ''}`);
    }

    updateButtonAppearance(this);
  }

  /**
   * Find the "Create a Pass" button to position near it
   */
  function findCreatePassButton() {
    // Look for common patterns for the Create a Pass button
    const selectors = [
      'button[data-testid*="create"]',
      'button:contains("Create a Pass")',
      'button:contains("Create Pass")',
      'a[href*="create"]',
      '.create-pass-button',
      '[data-cy*="create"]'
    ];

    for (let selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (let el of elements) {
          if (el.textContent.toLowerCase().includes('create') &&
              el.textContent.toLowerCase().includes('pass')) {
            return el;
          }
        }
      } catch (e) {
        // Ignore invalid selectors
      }
    }

    // Fallback: look for any button with "Create" in it
    const buttons = document.querySelectorAll('button, a[role="button"]');
    for (let button of buttons) {
      if (button.textContent.toLowerCase().includes('create a pass') ||
          button.textContent.toLowerCase().includes('create pass')) {
        return button;
      }
    }

    return null;
  }

  /**
   * Inject the toggle button near the Create a Pass button
   */
  function injectToggleButton() {
    // Check if button already exists
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    const createPassButton = findCreatePassButton();
    if (!createPassButton) {
      console.log('[Hide Offsale] Could not find Create a Pass button, using fallback position');
      // Fallback to fixed position if Create a Pass button not found
      injectFallbackButton();
      return;
    }

    // Create toggle button
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.addEventListener('click', handleToggleClick);

    // Update initial appearance
    updateButtonAppearance(button);

    // Insert the button near the Create a Pass button
    const parent = createPassButton.parentElement;
    if (parent) {
      // Insert before the Create a Pass button
      parent.insertBefore(button, createPassButton);
      console.log('[Hide Offsale] Toggle button injected successfully near Create a Pass button');
    } else {
      injectFallbackButton();
    }
  }

  /**
   * Fallback button injection (fixed position)
   */
  function injectFallbackButton() {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.addEventListener('click', handleToggleClick);
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10000;
      background-color: #0066ff;
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
      transition: all 0.2s ease-in-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    `;

    updateButtonAppearance(button);
    document.body.appendChild(button);
    console.log('[Hide Offsale] Fallback toggle button injected');
  }

  /**
   * Initialize the extension
   */
  function init() {
    // Wait for the page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectToggleButton();
        applyCurrentState();
      });
    } else {
      injectToggleButton();
      applyCurrentState();
    }

    // Watch for dynamic content updates
    const observer = new MutationObserver((mutations) => {
      // Ensure button exists (in case it gets removed)
      if (!document.getElementById(BUTTON_ID)) {
        injectToggleButton();
      }

      // Re-apply current state if new rows are added
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new table rows were added
          const hasNewRows = Array.from(mutation.addedNodes).some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.tagName === 'TR' || node.querySelector('tr'))
          );

          if (hasNewRows) {
            applyCurrentState();
          }
        }
      });
    });

    // Start observing for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('[Hide Offsale] Extension initialized');
  }

  // Start the extension
  init();
})();