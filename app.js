(function() {
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Demo logic: fake generation to show UX
  const form = qs('#demo-form');
  const input = qs('#demo-input');
  const output = qs('#demo-output');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const value = (input.value || '').trim();
      if (!value) {
        input.focus();
        return;
      }
      renderDemo(value);
    });
  }

  function renderDemo(seed) {
    output.innerHTML = '';
    const steps = [
      'Analyzing script and mapping scenes…',
      'Finding visual beats and hook points…',
      'Generating captions and timing…',
      'Blending music and motion graphics…',
      'Rendering preview…'
    ];
    const progress = document.createElement('div');
    progress.className = 'demo-card';
    progress.textContent = steps[0];
    output.appendChild(progress);

    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < steps.length) {
        progress.textContent = steps[i];
      } else {
        clearInterval(timer);
        output.removeChild(progress);
        showPreview(seed);
      }
    }, 600);
  }

  function showPreview(seed) {
    const card = document.createElement('div');
    card.className = 'demo-card';
    const thumb = document.createElement('div');
    thumb.className = 'demo-thumb';
    thumb.textContent = 'Preview';
    const caption = document.createElement('div');
    caption.style.margin = '10px 0 12px';
    caption.style.color = 'var(--muted)';
    caption.textContent = `Concept: ${seed}`;
    const actions = document.createElement('div');
    actions.className = 'demo-actions';
    const dl = button('Download MP4');
    const share = button('Share');
    const remix = button('Remix');
    actions.appendChild(dl);
    actions.appendChild(share);
    actions.appendChild(remix);
    card.appendChild(thumb);
    card.appendChild(caption);
    card.appendChild(actions);
    output.appendChild(card);

    dl.addEventListener('click', () => {
      promptToast('Upgrade to export full HD.');
    });
    share.addEventListener('click', () => {
      navigator.clipboard.writeText('https://lunatrium.example/preview/' + encodeURIComponent(seed));
      promptToast('Share link copied.');
    });
    remix.addEventListener('click', () => {
      promptToast('Remix created from template.');
    });
  }

  function button(label) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'btn btn-ghost';
    a.textContent = label;
    a.addEventListener('click', (e) => e.preventDefault());
    return a;
  }

  // Toasts
  function promptToast(message) {
    let t = qs('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.position = 'fixed';
      t.style.left = '50%';
      t.style.bottom = '24px';
      t.style.transform = 'translateX(-50%)';
      t.style.background = 'rgba(255,255,255,0.95)';
      t.style.color = '#0b0d12';
      t.style.padding = '10px 14px';
      t.style.borderRadius = '10px';
      t.style.boxShadow = '0 10px 24px rgba(0,0,0,0.25)';
      t.style.zIndex = '1000';
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.style.opacity = '1';
    clearTimeout(promptToast._timer);
    promptToast._timer = setTimeout(() => { t.style.opacity = '0'; }, 1600);
  }

  // CEO modal
  const modal = qs('#ceo-modal');
  const openBtn = qs('#open-ceo');
  const ceoForm = qs('#ceo-form');
  const ceoPass = qs('#ceo-pass');
  const ceoConsole = qs('#ceo-console');
  const ceoHint = qs('#ceo-hint');
  const saveBtn = qs('#save-config');

  const PASSCODE = '2047';

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.setAttribute('aria-hidden', 'false');
      ceoPass && ceoPass.focus();
    });
  }
  qsa('[data-close]', modal).forEach((el) => {
    el.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
  });
  if (ceoForm) {
    ceoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const ok = ceoPass.value === PASSCODE;
      if (ok) {
        ceoConsole.hidden = false;
        ceoHint.textContent = 'Unlocked';
        ceoHint.style.color = 'var(--ok)';
      } else {
        ceoHint.textContent = 'Wrong passcode';
        ceoHint.style.color = 'var(--warn)';
        ceoConsole.hidden = true;
      }
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const plan = qs('#default-plan').value;
      localStorage.setItem('lunatrium_default_plan', plan);
      promptToast('Default plan saved: ' + plan);
    });
  }

  // Feature flags toggles
  qsa('input[type="checkbox"][data-flag]', ceoConsole).forEach((box) => {
    box.addEventListener('change', () => {
      const flags = qsa('input[type="checkbox"][data-flag]', ceoConsole)
        .reduce((acc, el) => { acc[el.dataset.flag] = el.checked; return acc; }, {});
      localStorage.setItem('lunatrium_flags', JSON.stringify(flags));
      promptToast('Flags updated');
    });
  });
})();

