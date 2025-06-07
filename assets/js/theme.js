// Theme switching functionality
(function() {
  const STORAGE_KEY = 'theme-preference';
  
  // Get theme preference from localStorage or default to 'system'
  function getThemePreference() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    }
    return 'system';
  }
  
  // Set theme preference in localStorage
  function setThemePreference(theme) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }
  
  // Get the actual theme to apply (resolving 'system' to 'light' or 'dark')
  function getThemeToApply(preference) {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference;
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }
  
  // Initialize theme on page load
  function initTheme() {
    const preference = getThemePreference();
    const theme = getThemeToApply(preference);
    applyTheme(theme);
    
    // Update toggle button if it exists
    updateToggleButton(preference);
  }
  
  // Update theme toggle button state
  function updateToggleButton(preference) {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const theme = getThemeToApply(preference);
      toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
      toggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentPreference = getThemePreference();
    const currentTheme = getThemeToApply(currentPreference);
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setThemePreference(newTheme);
    applyTheme(newTheme);
    updateToggleButton(newTheme);
  }
  
  // Initialize theme immediately (before DOM loads)
  initTheme();
  
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      const preference = getThemePreference();
      if (preference === 'system') {
        const theme = getThemeToApply(preference);
        applyTheme(theme);
        updateToggleButton(preference);
      }
    });
  }
  
  // Set up theme toggle when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
      updateToggleButton(getThemePreference());
    }
  });
  
  // Expose toggle function globally for manual use
  window.toggleTheme = toggleTheme;
})();