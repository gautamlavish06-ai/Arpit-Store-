(function(){
  function normalizePhone(value){
    const digits = String(value || '').replace(/\D/g, '');
    return digits.slice(-10);
  }

  function normalizeWaLink(target, msg){
    const phone = normalizePhone(target || '');
    if (!phone) return '#';
    return 'https://wa.me/91' + phone + '?text=' + encodeURIComponent(msg || '');
  }

  function sanitizeHref(link, fallback){
    if (!link) return fallback;
    const href = String(link).trim();
    return href && /^https?:\/\//i.test(href) ? href : fallback;
  }

  document.addEventListener('DOMContentLoaded', function(){
    const phone = normalizePhone((window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '9005587907');
    const whatsapp = normalizePhone((window.CONFIG && window.CONFIG.whatsapp) ? window.CONFIG.whatsapp : phone);

    const safeWa = normalizeWaLink(whatsapp, (window.CONFIG && window.CONFIG.waMessage) || 'Namaste, mujhe aapke items ke baare me poochna hai.');
    const safeCall = 'tel:+91' + phone;
    const safeMap = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((window.CONFIG && window.CONFIG.mapQuery) || 'Arpit Store');

    document.querySelectorAll('[data-link]').forEach(function(el){
      const key = String(el.dataset.link || '').toLowerCase();
      let target = '#';
      if (key === 'wa') target = safeWa;
      else if (key === 'call') target = safeCall;
      else if (key === 'map') target = safeMap;
      el.setAttribute('href', target);
      if (key !== 'call') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });

    const dialog = document.getElementById('lightbox');
    if (dialog) {
      const closeDialogSafely = function(){
        if (dialog && dialog.open) {
          try { dialog.close(); } catch (e) { dialog.removeAttribute('open'); }
        }
        document.body.classList.remove('lock');
      };
      dialog.addEventListener('click', function(event){
        if (event.target === dialog) closeDialogSafely();
      });
      const closeBtn = dialog.querySelector('[data-lbclose]');
      if (closeBtn) closeBtn.addEventListener('click', closeDialogSafely);
    }

    const reviewLink = document.getElementById('gReview');
    if (reviewLink && reviewLink.href) {
      reviewLink.href = sanitizeHref(reviewLink.href, '#');
    }

    const noWa = document.getElementById('noWa');
    if (noWa) {
      noWa.href = sanitizeHref(noWa.href, safeWa);
    }

    const sheetWa = document.getElementById('sheetWa');
    if (sheetWa) {
      sheetWa.href = sanitizeHref(sheetWa.href, safeWa);
    }

    const gallery = document.getElementById('gallery');
    const vids = document.getElementById('videos');
    if (gallery && gallery.hidden) {
      gallery.hidden = false;
    }
    if (vids && vids.hidden) {
      vids.hidden = false;
    }
  });
})();
