// Wordmark on-load motion.
//  - Breadcrumb pages: the newest path segment wipes in left-to-right
//    (co/re -> co/re/about-me reveals just "/about-me"; a hub reveals co/lab).
//    The parent crumb and the dim "humancrafted" prefix stay put.
//  - Home page: the fused "humancrafted" splits back into "human" and
//    "crafted" and the "/" settles into the gap — the reverse of the
//    breadcrumb. Only on internal navigation (e.g. clicking back from a
//    sub-page), not on direct/external visits.
// No-JS / reduced-motion / hidden-tab loads just get the final static state.
(function () {
  var EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  var DURATION = 700;

  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Left-to-right clip wipe for the newest breadcrumb segment.
  function wipe(el) {
    if (el && typeof el.animate === 'function' &&
        el.getBoundingClientRect().width) {
      el.animate(
        [
          { clipPath: 'inset(0 100% 0 0)', opacity: 0, transform: 'translateX(-8px)' },
          { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'translateX(0)' }
        ],
        { duration: DURATION, easing: EASE }
      );
    }
  }

  // Home: "human|crafted" start fused, then crafted slides right to open the
  // gap while the slash fades/drops into the middle.
  function splitHome() {
    var bar = document.querySelector('a.site-title');
    if (!bar) return;
    var human = bar.querySelector('.wm-human');
    var slash = bar.querySelector('.wm-slash--home');
    var crafted = bar.querySelector('.wm-crafted');
    if (!human || !slash || !crafted || typeof crafted.animate !== 'function') return;

    var gap = crafted.getBoundingClientRect().left - human.getBoundingClientRect().right;
    if (gap <= 0) return; // measurement not ready — show static

    crafted.animate(
      [
        { transform: 'translateX(' + (-gap) + 'px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: DURATION, easing: EASE }
    );
    slash.animate(
      [
        { opacity: 0, transform: 'translateY(-3px)' },
        { opacity: 0, transform: 'translateY(-3px)', offset: 0.25 },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: DURATION, easing: EASE }
    );
  }

  function fromSameOrigin() {
    try {
      return !!document.referrer &&
        document.referrer.indexOf(location.origin + '/') === 0;
    } catch (e) {
      return false;
    }
  }

  function init() {
    // Skip for reduced-motion or when the page loads hidden/backgrounded
    // (a paused animation would hold elements in their start state).
    if (reducedMotion() || document.hidden) return;

    var crumb = document.querySelector('.site-title--crumb');
    if (crumb) {
      wipe(crumb.querySelector('.wm-new'));
      return;
    }

    if (fromSameOrigin()) {
      splitHome();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
