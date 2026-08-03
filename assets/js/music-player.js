/**
 * Thirty-second track previews on the Music note.
 *
 * One shared Audio element for the whole page, so starting a track always stops
 * whatever was playing — a table this long would otherwise happily play a dozen
 * previews at once. Preview URLs come from `preview_url:` in each track's front
 * matter, filled in by script/fetch-previews.py.
 *
 * The play/pause icons are injected here rather than written into the note,
 * because kramdown escapes and smart-quotes inline SVG that comes out of
 * markdown (same reason the STL viewer injects its hint icon).
 */
(function () {
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll('.track-play')
  );
  if (!buttons.length) return;

  // Lucide play / pause, minus the attributes that belong on the button.
  var ICONS = {
    play: '<polygon points="6 3 20 12 6 21 6 3"></polygon>',
    pause:
      '<rect x="14" y="4" width="4" height="16" rx="1"></rect>' +
      '<rect x="6" y="4" width="4" height="16" rx="1"></rect>',
  };

  function icon(name) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      ICONS[name] +
      '</svg>'
    );
  }

  var audio = new Audio();
  audio.preload = 'none';
  var current = null; // the button whose preview is loaded

  function reset(button) {
    if (!button) return;
    button.innerHTML = icon('play');
    button.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
  }

  function stop() {
    audio.pause();
    reset(current);
    current = null;
  }

  buttons.forEach(function (button) {
    reset(button);

    button.addEventListener('click', function () {
      if (current === button) {
        // Toggle the track that's already loaded.
        if (audio.paused) {
          audio.play();
          button.innerHTML = icon('pause');
          button.classList.add('is-playing');
          button.setAttribute('aria-pressed', 'true');
        } else {
          audio.pause();
          reset(button);
        }
        return;
      }

      reset(current);
      current = button;
      audio.src = button.dataset.preview;
      button.innerHTML = icon('pause');
      button.classList.add('is-playing');
      button.setAttribute('aria-pressed', 'true');

      var started = audio.play();
      if (started && started.catch) {
        // Autoplay policy, a dead CDN link, an unsupported codec — fall back to
        // the plain state rather than leaving a pause icon on silence.
        started.catch(function () {
          reset(button);
          current = null;
        });
      }
    });
  });

  audio.addEventListener('ended', stop);
  audio.addEventListener('error', stop);
})();
