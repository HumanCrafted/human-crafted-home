// Loops signup form. Progressive enhancement: without JS the form does a native
// POST and Loops answers with raw JSON on its own domain. With JS we post the
// same body via fetch and report the result inline, so the reader stays put.
// The endpoint is public by design (the form ID is the auth) — no key here.
(function () {
  'use strict';

  var MESSAGES = {
    success: 'Thanks — you\'re on the list.',
    rate:    'Too many tries. Give it a minute and try again.',
    failed:  'That didn\'t go through. Try again, or email hello@humancrafted.co.'
  };

  function setStatus(el, message, ok) {
    el.textContent = message;
    el.classList.toggle('is-error', !ok);
    el.classList.toggle('is-success', !!ok);
  }

  function handle(form) {
    var status = form.querySelector('.subscribe-status');
    var button = form.querySelector('.subscribe-btn');
    if (!status || !button || typeof window.fetch !== 'function') return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.dataset.busy === '1') return;
      form.dataset.busy = '1';
      button.disabled = true;
      setStatus(status, 'Signing up…', true);

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (response) {
        // Loops sends {success:false,message} with a 400, so read the body either way.
        return response.json().catch(function () { return {}; }).then(function (data) {
          return { status: response.status, data: data };
        });
      }).then(function (result) {
        if (result.data.success) {
          setStatus(status, MESSAGES.success, true);
          form.reset();
        } else if (result.status === 429) {
          setStatus(status, MESSAGES.rate, false);
        } else {
          setStatus(status, result.data.message || MESSAGES.failed, false);
        }
      }).catch(function () {
        setStatus(status, MESSAGES.failed, false);
      }).then(function () {
        form.dataset.busy = '0';
        button.disabled = false;
      });
    });
  }

  function init() {
    var forms = document.querySelectorAll('.subscribe-form');
    for (var i = 0; i < forms.length; i++) handle(forms[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
