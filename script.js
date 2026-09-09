/* ============================================================================
   HydroClean — script principal
   ========================================================================== */
'use strict';

const CFG = window.HYDROCLEAN_CONFIG || {};
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const dom = {
  preloader: $('#preloader'),
  scrollProgress: $('#scrollProgress'),
  header: $('#siteHeader'),
  bgCanvas: $('#bgCanvas'),
  themeToggle: $('#themeToggle'),
  mobileToggle: $('#mobileToggle'),
  nav: $('#nav'),
  navLinks: $$('.nav-link'),
  toast: $('#toast'),
  backTop: $('#backTop'),
  // simulador
  simPeople: $('#simPeople'),
  simPeopleOut: $('#simPeopleOut'),
  simUse: $('#simUse'),
  simPrio: $('#simPrio'),
  simModel: $('#simModel'),
  simDesc: $('#simDesc'),
  simDemand: $('#simDemand'),
  simCapacity: $('#simCapacity'),
  simBar: $('#simBar'),
  simCap: $('#simCap'),
  simPanels: $('#simPanels'),
  simPrice: $('#simPrice'),
  simWhy: $('#simWhy'),
  simResult: $('.sim-result'),
  // contato
  contactForm: $('#contactForm'),
  cFeedback: $('#cFeedback'),
  cHint: $('#cHint'),
  contactLinks: $('#contactLinks'),
  footerSocial: $('#footerSocial'),
  // fluxo
  flowPipe: $('#flowPipe'),
  flowDrop: $('#flowDrop'),
  flowNodes: $$('.flow-node'),
};

/* ---------------------------------------------------------------- Tema ----- */
const THEME_KEY = 'hydroclean_theme';
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.dataset.theme = saved;
  dom.themeToggle.textContent = saved === 'dark' ? '☀' : '☾';
}
function toggleTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  dom.themeToggle.textContent = next === 'dark' ? '☀' : '☾';
  localStorage.setItem(THEME_KEY, next);
  showToast(`Tema ${next === 'dark' ? 'escuro' : 'claro'} aplicado.`);
}

/* --------------------------------------------------------------- Toast ----- */
function showToast(msg){
  dom.toast.textContent = msg;
  dom.toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => dom.toast.classList.remove('is-visible'), 2800);
}

/* ------------------------------------------------------- Scroll / progresso -- */
function onScroll(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  dom.scrollProgress.style.width = (max <= 0 ? 0 : (window.scrollY / max) * 100) + '%';
  dom.header.classList.toggle('scrolled', window.scrollY > 8);
  highlightNav();
}
function highlightNav(){
  const pt = window.scrollY + 120;
  dom.navLinks.forEach(link => {
    const sel = link.getAttribute('href');
    if (!sel || !sel.startsWith('#')) return;
    const sec = document.querySelector(sel);
    if (!sec) return;
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    link.classList.toggle('is-active', pt >= top && pt < bottom);
  });
}

/* --------------------------------------------------- Reveal (IntersectionObs) */
function initReveal(){
  const els = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ------------------------------------------------- Contadores animados ----- */
function initCounters(){
  const els = $$('[data-counter]');
  if (prefersReduced || !('IntersectionObserver' in window)){
    els.forEach(el => el.textContent = Number(el.dataset.counter).toLocaleString('pt-BR'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = Number(el.dataset.counter);
      const dur = 1400, t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = val.toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('pt-BR');
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
}

/* ============================================================================
   FUNDO DE MICROALGAS — sofisticado, orgânico e leve
   ========================================================================== */
function initBackground(){
  const c = dom.bgCanvas;
  if (!c || prefersReduced) return;
  const ctx = c.getContext('2d');
  const isMobile = window.innerWidth < 760;

  // Densidade adaptativa (performance em celular / low-end)
  const cores = navigator.hardwareConcurrency || 4;
  let count = isMobile ? 22 : 40;
  if (cores <= 2) count = Math.round(count * 0.6);

  let W, H, dpr, particles = [], running = true, raf = null;
  const PALETTE = ['#5EC4F5', '#8BC34A', '#26BDE2', '#A5D6A7'];

  function makeParticle(){
    const depth = Math.random();            // 0 = fundo, 1 = frente -> profundidade
    const isAlga = Math.random() < 0.35;    // parte com formato de microalga
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: (isMobile ? 1.5 : 2) + depth * (isAlga ? 5 : 3.5),
      depth,
      alpha: 0.05 + depth * 0.22,           // transparências variadas
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
      isAlga,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.004,
      // movimento lento e orgânico
      vx: (Math.random() - 0.5) * 0.12 * (0.4 + depth),
      vy: -(0.05 + depth * 0.18),           // sobem suavemente
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.003 + Math.random() * 0.004
    };
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = c.clientWidth = window.innerWidth;
    H = c.clientHeight = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: count }, makeParticle);
  }

  function drawAlga(p){
    // microalga estilizada: elipse alongada e girando
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 1.7, p.r * 0.75, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.restore();
  }

  function frame(){
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles){
      p.drift += p.driftSpeed;
      p.x += p.vx + Math.sin(p.drift) * 0.15;   // deriva horizontal suave
      p.y += p.vy;
      p.angle += p.spin;
      if (p.y < -20){ p.y = H + 20; p.x = Math.random() * W; }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;

      if (p.isAlga){
        drawAlga(p);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', debounce(resize, 250));
  // Pausa quando a aba não está visível (economiza bateria)
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !prefersReduced){ cancelAnimationFrame(raf); frame(); }
  });
  frame();
}
function debounce(fn, ms){ let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* ============================================================================
   FLUXO "COMO FUNCIONA" — água percorrendo o sistema
   ========================================================================== */
function initFlow(){
  if (!dom.flowPipe || prefersReduced) {
    if (dom.flowPipe){ dom.flowPipe.style.width = '100%'; if(dom.flowDrop) dom.flowDrop.style.left = '100%'; }
    return;
  }
  let started = false;
  const section = document.getElementById('como-funciona');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && !started){ started = true; runPipe(); } });
  }, { threshold: .4 });
  if (section) io.observe(section);

  function runPipe(){
    const dur = 3200, t0 = performance.now();
    const tick = now => {
      let p = ((now - t0) % dur) / dur;        // loop contínuo
      const pct = p * 100;
      dom.flowPipe.style.width = pct + '%';
      dom.flowDrop.style.left = pct + '%';
      // ativa o nó correspondente
      const idx = Math.min(dom.flowNodes.length - 1, Math.floor(p * dom.flowNodes.length));
      dom.flowNodes.forEach((n, i) => n.classList.toggle('active', i === idx));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* ============================================================================
   SIMULADOR — cálculo dinâmico
   ========================================================================== */
const SIM = CFG.simulador || {};
const simState = { people: 4, use: 'residencial', prio: 'economia' };

function calcSim(){
  const litrosPP  = SIM.litrosPorPessoaDia ?? 50;
  const fatorUso  = (SIM.fatorUso && SIM.fatorUso[simState.use]) ?? 1;
  const margem    = SIM.margemSeguranca ?? 1.15;
  const fatorPrio = (SIM.fatorPrioridade && SIM.fatorPrioridade[simState.prio]) ?? 1;

  const demanda = simState.people * litrosPP * fatorUso;        // L/dia
  const capacidadeRecomendada = demanda * margem * fatorPrio;   // L/dia

  const modelos = (SIM.modelos || []).slice().sort((a, b) => a.capacidade - b.capacidade);
  // candidatos que atendem à capacidade
  let candidatos = modelos.filter(m => m.capacidade >= capacidadeRecomendada);
  let modelo, motivo;

  if (candidatos.length){
    // prefere modelo cujas tags combinam com o uso; senão o de menor capacidade suficiente
    const porUso = candidatos.find(m => (m.tags || []).includes(simState.use));
    modelo = porUso || candidatos[0];
    if (porUso && porUso !== candidatos[0]){
      motivo = `Atende à capacidade recomendada e é o modelo indicado para uso ${labelUso(simState.use)}.`;
    } else {
      motivo = `É o menor modelo que atende à capacidade recomendada de ${fmt(capacidadeRecomendada)} L/dia, priorizando ${labelPrio(simState.prio)}.`;
    }
  } else {
    // demanda acima do catálogo -> maior modelo disponível
    modelo = modelos[modelos.length - 1];
    motivo = `A demanda estimada supera o catálogo atual. Sugerimos o modelo de maior capacidade e a avaliação de mais de uma unidade.`;
  }

  return { demanda, capacidadeRecomendada, modelo, motivo };
}

function fmt(n){ return Math.round(n).toLocaleString('pt-BR'); }
function labelUso(v){ return ({residencial:'residencial',rural:'rural',escola:'escolar',empresa:'empresarial',emergencia:'emergencial'})[v] || v; }
function labelPrio(v){ return ({economia:'economia',equilibrio:'equilíbrio entre capacidade e custo',capacidade:'maior capacidade'})[v] || v; }

function renderSim(){
  const { demanda, capacidadeRecomendada, modelo, motivo } = calcSim();
  if (!modelo) return;

  // microanimação de "calculando"
  dom.simResult.classList.add('calc');
  setTimeout(() => dom.simResult.classList.remove('calc'), 220);

  dom.simModel.textContent = modelo.nome;
  dom.simDesc.textContent  = modelo.desc;
  dom.simCap.textContent   = 'Até ' + fmt(modelo.capacidade) + ' L/dia';
  dom.simPanels.textContent = modelo.paineis;
  dom.simPrice.textContent  = modelo.preco;
  dom.simWhy.textContent    = motivo;

  animateNumber(dom.simDemand, demanda, ' L/dia');
  animateNumber(dom.simCapacity, capacidadeRecomendada, ' L/dia');

  // barra: demanda em relação à capacidade do modelo (limite 100%)
  const ratio = Math.min(100, (demanda / modelo.capacidade) * 100);
  requestAnimationFrame(() => dom.simBar.style.width = ratio + '%');

  const pl = simState.people === 1 ? 'pessoa' : 'pessoas';
  dom.simPeopleOut.textContent = `${simState.people} ${pl}`;
}

function animateNumber(el, target, suffix){
  if (prefersReduced){ el.textContent = fmt(target) + suffix; return; }
  const from = parseFloat((el.textContent || '0').replace(/\D/g, '')) || 0;
  const dur = 500, t0 = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - t0) / dur);
    const val = from + (target - from) * (1 - Math.pow(1 - p, 3));
    el.textContent = fmt(val) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initSim(){
  if (!dom.simPeople) return;
  if (SIM.minPessoas) dom.simPeople.min = SIM.minPessoas;
  if (SIM.maxPessoas) dom.simPeople.max = SIM.maxPessoas;

  dom.simPeople.addEventListener('input', e => {
    simState.people = Number(e.target.value);
    renderSim();
  });
  [['simUse','use'], ['simPrio','prio']].forEach(([id, key]) => {
    const g = document.getElementById(id);
    if (!g) return;
    g.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        g.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
        simState[key] = btn.dataset.v;
        renderSim();
      });
    });
  });
  renderSim();
}

/* ============================================================================
   RESULTADOS EXPERIMENTAIS — render a partir do config (sem inventar dados)
   ========================================================================== */
function initResults(){
  const grid = document.getElementById('resultsGrid');
  const noteEl = document.getElementById('resultsNote');
  const cfg = CFG.resultados;
  if (!grid || !cfg) return;
  if (noteEl && cfg.observacao) noteEl.textContent = cfg.observacao;

  grid.innerHTML = (cfg.parametros || []).map(p => {
    const preenchido = p.antes != null && p.depois != null;
    const unid = p.unidade ? ' ' + p.unidade : '';
    let barra = '';
    if (preenchido && p.melhor !== 'neutro' && Number.isFinite(+p.antes) && Number.isFinite(+p.depois)){
      const a = +p.antes, d = +p.depois;
      const max = Math.max(a, d) || 1;
      barra = `<div class="rc-bar"><span style="width:${Math.min(100,(d/max)*100)}%"></span></div>`;
    }
    const valAntes = p.antes != null ? `${p.antes}${unid}` : '—';
    const valDepois = p.depois != null ? `${p.depois}${unid}` : '—';
    return `
      <article class="result-card reveal">
        <div class="rc-head">
          <h3>${p.nome}</h3>
          <span class="rc-badge ${preenchido ? 'filled' : 'pending'}">${preenchido ? 'Medido' : 'Aguardando dados'}</span>
        </div>
        <div class="rc-compare">
          <div class="rc-val ${p.antes==null?'empty':''}"><small>Antes</small><b>${valAntes}</b></div>
          <div class="rc-arrow" aria-hidden="true">→</div>
          <div class="rc-val ${p.depois==null?'empty':''}"><small>Depois</small><b>${valDepois}</b></div>
        </div>
        ${barra}
      </article>`;
  }).join('');
}

/* ============================================================================
   CONTATOS — links funcionais a partir do config
   ========================================================================== */
function buildContactURLs(){
  const c = CFG.contato || {};
  const wa  = (c.whatsapp || '').replace(/\D/g, '');
  const tel = (c.telefone || '').replace(/\D/g, '');
  const insta = (c.instagram || '').replace(/^@/, '');
  return {
    whatsapp: wa ? `https://wa.me/${wa}?text=${encodeURIComponent(c.whatsappMensagem || '')}` : '#',
    instagram: insta ? `https://instagram.com/${insta}` : '#',
    email: c.email ? `mailto:${c.email}` : '#',
    telefone: tel ? `tel:+${tel}` : '#',
    _raw: { wa, tel, insta, email: c.email, telLabel: c.telefoneLabel, instaHandle: insta }
  };
}

function initContacts(){
  const c = CFG.contato || {};
  const u = buildContactURLs();

  if (dom.contactLinks){
    dom.contactLinks.innerHTML = `
      <a class="ci" href="${u.whatsapp}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
        <span class="ci-icon" aria-hidden="true">💬</span>
        <span class="ci-text"><small>WhatsApp</small><b>Falar com a equipe</b></span></a>
      <a class="ci" href="${u.instagram}" target="_blank" rel="noopener" aria-label="Abrir Instagram">
        <span class="ci-icon" aria-hidden="true">📸</span>
        <span class="ci-text"><small>Instagram</small><b>@${u._raw.instaHandle || 'perfil'}</b></span></a>
      <a class="ci" href="${u.email}" aria-label="Enviar e-mail">
        <span class="ci-icon" aria-hidden="true">✉️</span>
        <span class="ci-text"><small>E-mail</small><b>${c.email || 'e-mail do projeto'}</b></span></a>
      <a class="ci" href="${u.telefone}" aria-label="Ligar por telefone">
        <span class="ci-icon" aria-hidden="true">📞</span>
        <span class="ci-text"><small>Telefone</small><b>${c.telefoneLabel || 'ligar'}</b></span></a>`;
  }
  if (dom.footerSocial){
    dom.footerSocial.innerHTML = `
      <li><a href="${u.instagram}" target="_blank" rel="noopener">Instagram</a></li>
      <li><a href="${u.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
      <li><a href="${u.email}">E-mail</a></li>`;
  }
}

/* ============================================================================
   FORMULÁRIO DE CONTATO — feedback honesto (sem simular envio)
   ========================================================================== */
function initForm(){
  const f = dom.contactForm;
  if (!f) return;

  const destino = (CFG.formulario && CFG.formulario.destino) || 'whatsapp';
  const u = buildContactURLs();

  // Dica honesta ao usuário sobre o que acontece ao enviar
  if (dom.cHint){
    dom.cHint.textContent = destino === 'email'
      ? 'Ao enviar, seu aplicativo de e-mail será aberto com a mensagem pronta para envio.'
      : 'Ao enviar, você será direcionado ao WhatsApp para concluir o envio da mensagem.';
  }

  f.addEventListener('submit', e => {
    e.preventDefault();
    const name  = $('#cName').value.trim();
    const email = $('#cEmail').value.trim();
    const org   = $('#cOrg').value.trim();
    const subj  = $('#cSubject').value;
    const msg   = $('#cMsg').value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // validação
    clearInvalid();
    let err = null;
    if (name.length < 3){ err = 'Por favor, informe um nome válido.'; markInvalid('#cName'); }
    else if (!re.test(email)){ err = 'Por favor, informe um e-mail válido.'; markInvalid('#cEmail'); }
    else if (msg.length < 10){ err = 'Escreva uma mensagem um pouco mais detalhada.'; markInvalid('#cMsg'); }

    if (err){
      dom.cFeedback.textContent = err;
      dom.cFeedback.classList.add('error');
      return;
    }
    dom.cFeedback.classList.remove('error');

    const corpo =
      `Nome: ${name}\n` +
      `E-mail: ${email}\n` +
      (org ? `Instituição: ${org}\n` : '') +
      `Assunto: ${subj}\n\n` +
      `Mensagem:\n${msg}`;

    if (destino === 'email'){
      const to = (CFG.contato && CFG.contato.email) || '';
      const href = `mailto:${to}?subject=${encodeURIComponent('[HydroClean] ' + subj)}&body=${encodeURIComponent(corpo)}`;
      dom.cFeedback.textContent = 'Abrindo seu aplicativo de e-mail para concluir o envio…';
      window.location.href = href;
    } else {
      const wa = (CFG.contato && CFG.contato.whatsapp || '').replace(/\D/g, '');
      if (!wa){
        dom.cFeedback.textContent = 'Canal de contato ainda não configurado. Configure o WhatsApp em config.js.';
        dom.cFeedback.classList.add('error');
        return;
      }
      const href = `https://wa.me/${wa}?text=${encodeURIComponent('[HydroClean]\n' + corpo)}`;
      dom.cFeedback.textContent = 'Você será direcionado ao WhatsApp para concluir o envio da mensagem.';
      showToast('Redirecionando para o WhatsApp…');
      window.open(href, '_blank', 'noopener');
    }
  });

  function markInvalid(sel){ const el = $(sel); if (el) el.classList.add('invalid'); }
  function clearInvalid(){ $$('.contact-form .invalid').forEach(el => el.classList.remove('invalid')); }
}

/* ------------------------------------------------------------ Eventos ------ */
function initEvents(){
  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.mobileToggle.addEventListener('click', () => {
    const open = dom.nav.classList.toggle('is-open');
    dom.mobileToggle.setAttribute('aria-expanded', String(open));
  });
  dom.navLinks.forEach(l => l.addEventListener('click', () => {
    if (window.innerWidth <= 860){
      dom.nav.classList.remove('is-open');
      dom.mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }));
  dom.backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 860){
      dom.nav.classList.remove('is-open');
      dom.mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }, 200));
}

/* ---------------------------------------------------------- Inicialização -- */
function init(){
  initTheme();
  initEvents();
  initContacts();
  initResults();
  initReveal();      // observa também os cards de resultados recém-criados
  initCounters();
  initSim();
  initForm();
  initBackground();
  initFlow();
  onScroll();
  setTimeout(() => dom.preloader.classList.add('hidden'), 700);
}
document.addEventListener('DOMContentLoaded', init);
