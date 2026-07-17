// ====== CONFIGURACIÓN ======
// Pega aquí la URL de tu Google Apps Script (termina en /exec)
const SHEETS_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";

// ====== Menú móvil ======
const toggle = document.getElementById('menuToggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
  document.querySelectorAll('#navLinks a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
  );
}

// ====== Envío de formularios a Google Sheets ======
document.querySelectorAll('form[data-tipo]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const msg = form.querySelector('.form-msg');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    msg.className = 'form-msg';

    const data = { tipo: form.dataset.tipo, fecha: new Date().toLocaleString('es-CO') };
    new FormData(form).forEach((v, k) => data[k] = v);

    // Agrupa campos especificos del ramo en una sola columna 'detalle'
    const base = ['tipo','fecha','nombre','telefono','email','ciudad','ramo','perfil','fuente','detalle'];
    const extras = Object.keys(data).filter(k => !base.includes(k) && data[k]);
    if (extras.length) {
      data.detalle = extras.map(k => k.replace(/_/g,' ') + ': ' + data[k]).join(' | ');
      extras.forEach(k => delete data[k]);
    }

    try {
      if (SHEETS_URL.startsWith('http')) {
        await fetch(SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data)
        });
      } else {
        console.warn('SHEETS_URL sin configurar. Datos:', data);
      }
      msg.textContent = '✅ ¡Listo! Recibimos tu solicitud. Un asesor te contactará muy pronto.';
      msg.classList.add('ok');
      form.reset();
    } catch (err) {
      msg.textContent = '⚠️ Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.';
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
});


// ====== Animaciones de aparición al hacer scroll ======
(function(){
  var sel = '.section-head, .promo-banner, .product-card, .coverage-card, .why-card, .stat-big, .step-card, .testimonial, .portfolio-card, .band-item, .photo-card';
  var els = document.querySelectorAll(sel);
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: .12});
  els.forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
})();
