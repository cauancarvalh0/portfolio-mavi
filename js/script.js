(function () {
  'use strict';

  /* ===== DADOS DA MARIA VITÓRIA: preencha aqui (deixe '' para esconder o link) ===== */
  var CONFIG = {
    email: 'seuemail@exemplo.com',
    linkedin: '',      // ex.: https://www.linkedin.com/in/seu-perfil
    instagram: '',     // ex.: https://instagram.com/seu_usuario
    whatsapp: ''       // somente números com DDI e DDD, ex.: 5599999999999
  };
  /* ================================================================================ */

  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  document.getElementById('ano').textContent = new Date().getFullYear();

  /* Links de contato */
  document.querySelectorAll('[data-config]').forEach(function (el) {
    var chave = el.getAttribute('data-config');
    var valor = CONFIG[chave];
    if (!valor) { el.hidden = true; return; }
    if (chave === 'email') {
      el.href = 'mailto:' + valor;
      var rotulo = el.querySelector('span'); if (rotulo) rotulo.textContent = valor;
    } else if (chave === 'whatsapp') {
      el.href = 'https://wa.me/' + valor.replace(/\D/g, '');
    } else {
      el.href = valor;
    }
  });

  /* Fotos: se o arquivo existir, entra no lugar do espaço reservado */
  document.querySelectorAll('[data-foto]').forEach(function (slot) {
    var img = new Image();
    img.alt = slot.getAttribute('data-rotulo') || '';
    img.onload = function () { slot.appendChild(img); slot.classList.add('tem-foto'); };
    img.src = slot.getAttribute('data-foto');
  });

  /* Vídeo de fundo: um arquivo por lado; só aparece se o arquivo existir */
  var VIDEOS = {
    bio: ['video/fundo.mp4', 'video/fundo.webm'],
    adm: ['video/fundo-adm.mp4', 'video/fundo-adm.webm']
  };
  var video = document.getElementById('video-fundo');
  var caixaVideo = video.parentElement;
  video.addEventListener('loadeddata', function () {
    caixaVideo.classList.add('ativo');
    if (!reduzir) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  });
  function carregarVideo(lado) {
    caixaVideo.classList.remove('ativo');
    video.pause();
    while (video.firstChild) video.removeChild(video.firstChild);
    VIDEOS[lado].forEach(function (src) {
      var fonte = document.createElement('source');
      fonte.src = src;
      fonte.type = src.indexOf('.webm') > -1 ? 'video/webm' : 'video/mp4';
      video.appendChild(fonte);
    });
    video.load();
  }

  /* Topo ganha borda ao rolar */
  var topo = document.querySelector('.topo');
  function aoRolar() { topo.classList.toggle('rolou', window.scrollY > 8); }
  window.addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

  /* Revelar ao rolar */
  var itens = document.querySelectorAll('.reveal');
  if (reduzir || !('IntersectionObserver' in window)) {
    itens.forEach(function (e) { e.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (lista) {
      lista.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('in'); obs.unobserve(i.target); } });
    }, { threshold: 0.15 });
    itens.forEach(function (e) { obs.observe(e); });
  }

  /* Batimento: comprimento do traço para a animação */
  var pulso = document.querySelector('.ecg-pulso');
  if (pulso) pulso.style.setProperty('--len', Math.ceil(pulso.getTotalLength()) + 160);

  /* DNA: dupla hélice animada */
  var dna = document.getElementById('dna');
  if (dna) {
    var N = 13, pares = [];
    for (var i = 0; i < N; i++) {
      var y = 14 + i * 14;
      var linha = document.createElementNS(SVGNS, 'line'); linha.setAttribute('class', 'dna-linha');
      var a = document.createElementNS(SVGNS, 'circle'); a.setAttribute('class', 'dna-a');
      var b = document.createElementNS(SVGNS, 'circle'); b.setAttribute('class', 'dna-b');
      dna.appendChild(linha); dna.appendChild(a); dna.appendChild(b);
      pares.push({ y: y, linha: linha, a: a, b: b });
    }
    var desenhar = function (t) {
      pares.forEach(function (p, i) {
        var fase = t + i * 0.55, s = Math.sin(fase), c = Math.cos(fase);
        var x1 = 80 + 46 * s, x2 = 80 - 46 * s;
        p.linha.setAttribute('x1', x1); p.linha.setAttribute('x2', x2);
        p.linha.setAttribute('y1', p.y); p.linha.setAttribute('y2', p.y);
        p.a.setAttribute('cx', x1); p.a.setAttribute('cy', p.y); p.a.setAttribute('r', 5 + 2 * c);
        p.b.setAttribute('cx', x2); p.b.setAttribute('cy', p.y); p.b.setAttribute('r', 5 - 2 * c);
      });
    };
    if (reduzir) { desenhar(0.6); } else {
      var inicio = performance.now();
      (function quadro(agora) { desenhar((agora - inicio) / 900); requestAnimationFrame(quadro); })(inicio);
    }
  }

  /* Método: acende um passo por vez, em sincronia com o trilho */
  if (!reduzir) {
    ['passos', 'adm-passos'].forEach(function (id) {
      var grupo = document.querySelectorAll('#' + id + ' .passo');
      if (!grupo.length) return;
      var atual = 0;
      var acender = function () {
        grupo.forEach(function (p, i) { p.classList.toggle('ativo', i === atual); });
        atual = (atual + 1) % grupo.length;
      };
      acender(); setInterval(acender, 1600);
    });
  }

  /* Quadro de tarefas (lado administrativo): cartões avançam de coluna */
  var kanban = document.getElementById('kanban');
  if (kanban) {
    var cartoes = Array.prototype.slice.call(kanban.querySelectorAll('.kcard'));
    var colX = [16, 134, 252];
    var estagio = [2, 1, 0, 0];
    var posicionar = function (animar) {
      [0, 1, 2].forEach(function (c) {
        var fila = cartoes.filter(function (_, i) { return estagio[i] === c; });
        fila.forEach(function (g, slot) {
          g.setAttribute('transform', 'translate(' + colX[c] + ',' + (40 + slot * 46) + ')');
        });
      });
      cartoes.forEach(function (g, i) { g.classList.toggle('feito', estagio[i] === 2); });
    };
    posicionar();
    if (!reduzir) {
      var vez = 0;
      setInterval(function () {
        if (document.body.getAttribute('data-lado') !== 'adm') return;
        var k = vez++ % cartoes.length, g = cartoes[k];
        if (estagio[k] === 2) {
          g.style.opacity = 0;
          setTimeout(function () { g.style.transition = 'none'; estagio[k] = 0; posicionar(); void g.getBoundingClientRect(); g.style.transition = ''; g.style.opacity = 1; }, 400);
        } else { estagio[k] += 1; posicionar(); }
      }, 1700);
    }
  }

  /* ===== Alternar entre o lado biomédico e o administrativo ===== */
  var ROTULOS = { bio: 'Lado biomédico', adm: 'Lado administrativo' };
  var TITULOS = { bio: 'Maria Vitória | Portfólio Profissional', adm: 'Maria Vitória | Lado administrativo' };
  var painel = document.querySelector('.transicao');
  var rotuloPainel = document.getElementById('transicao-rotulo');
  var ocupado = false;

  function aplicarLado(lado) {
    document.body.setAttribute('data-lado', lado);
    document.getElementById('lado-bio').hidden = (lado !== 'bio');
    document.getElementById('lado-adm').hidden = (lado !== 'adm');
    document.querySelectorAll('.alterna button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-ir') === lado));
    });
    document.title = TITULOS[lado];
    carregarVideo(lado);
    try { localStorage.setItem('lado', lado); } catch (e) {}
    try { history.replaceState(null, '', lado === 'adm' ? '?lado=adm' : window.location.pathname); } catch (e) {}
    window.scrollTo(0, 0);
    if (window.bootstrap && bootstrap.ScrollSpy) bootstrap.ScrollSpy.getOrCreateInstance(document.body).refresh();
  }

  function trocar(lado) {
    if (ocupado || document.body.getAttribute('data-lado') === lado) return;
    if (reduzir) { aplicarLado(lado); return; }
    ocupado = true;
    rotuloPainel.textContent = ROTULOS[lado];
    painel.classList.remove('sai');
    painel.classList.add('entra');
    setTimeout(function () {
      aplicarLado(lado);
      painel.classList.remove('entra');
      painel.classList.add('sai');
      setTimeout(function () {
        painel.classList.remove('sai');
        painel.style.transition = 'none'; void painel.offsetHeight; painel.style.transition = '';
        ocupado = false;
      }, 520);
    }, 900);
  }

  document.querySelectorAll('[data-ir]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); trocar(el.getAttribute('data-ir')); });
  });

  var ladoInicial = 'bio';
  try {
    var q = new URLSearchParams(window.location.search).get('lado');
    var salvo = localStorage.getItem('lado');
    ladoInicial = (q === 'adm' || q === 'bio') ? q : (salvo === 'adm' ? 'adm' : 'bio');
  } catch (e) {}
  aplicarLado(ladoInicial);
  window.scrollTo(0, 0);

  /* Formulário: valida e abre o e-mail com a mensagem pronta */
  var form = document.getElementById('form-contato');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var msg = document.getElementById('mensagem').value.trim();
    var corpo = msg + '\n\n' + nome + '\n' + email;
    window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Contato pelo portfólio') + '&body=' + encodeURIComponent(corpo);
  });
})();
