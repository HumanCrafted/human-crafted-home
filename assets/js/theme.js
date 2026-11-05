// Theme: follow the system, unless the toggle has overridden it.
//
// A toggle click holds only until the system next changes. An override is
// always the opposite of the system theme, so storing the theme alone is
// enough: once the two match, the system has changed and the override is
// dropped. Toggling back to match the system releases it the same way.
(function() {
  const OVERRIDE_KEY = 'theme-override';
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function readOverride() {
    try { return localStorage.getItem(OVERRIDE_KEY); } catch (e) { return null; }
  }

  function writeOverride(theme) {
    try { localStorage.setItem(OVERRIDE_KEY, theme); } catch (e) {}
  }

  function clearOverride() {
    try { localStorage.removeItem(OVERRIDE_KEY); } catch (e) {}
  }

  function systemTheme() {
    return systemDark.matches ? 'dark' : 'light';
  }

  // The theme to show right now, dropping an override the system has caught up to.
  function currentTheme() {
    const override = readOverride();
    if (!override) return systemTheme();
    if (override === systemTheme()) {
      clearOverride();
      return systemTheme();
    }
    return override;
  }

  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // Icon visibility is handled by CSS from data-theme.
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
  }

  function toggleTheme() {
    const newTheme = currentTheme() === 'light' ? 'dark' : 'light';

    if (newTheme === systemTheme()) {
      clearOverride();
    } else {
      writeOverride(newTheme);
    }
    applyTheme(newTheme);
  }

  // Runs in <head>, before first paint.
  // The old key pinned a toggle click forever; clear it so everyone starts back on the system.
  try { localStorage.removeItem('theme-preference'); } catch (e) {}
  applyTheme(currentTheme());

  // The system changed: any override is over.
  systemDark.addEventListener('change', function() {
    clearOverride();
    applyTheme(systemTheme());
  });

  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
      applyTheme(currentTheme());
    }
  });
})();
