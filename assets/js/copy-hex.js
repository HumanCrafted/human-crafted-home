// Click-to-copy hex values. Used by the design-system swatch chips
// (.system-chip, hex in a .chip-hex child) and the materials table
// (.copy-hex, the element is the hex itself). Clicking, Enter or Space
// copies the hex and flashes "copied!" in its place for a moment.
(function () {
  document.querySelectorAll('.system-chip, .copy-hex').forEach(function (chip) {
    var hexEl = chip.querySelector('.chip-hex') || chip;
    var hex = hexEl.textContent.trim();
    if (!hex) return;
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-label', 'Copy hex ' + hex);
    chip.title = 'Click to copy ' + hex;
    var resetTimer;
    function flash() {
      chip.classList.add('copied');
      hexEl.textContent = 'copied!';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        hexEl.textContent = hex;
        chip.classList.remove('copied');
      }, 1100);
    }
    function legacyCopy() {
      var ta = document.createElement('textarea');
      ta.value = hex;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      flash();
    }
    function copy() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(flash).catch(legacyCopy);
      } else {
        legacyCopy();
      }
    }
    chip.addEventListener('click', copy);
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });
  });
})();
