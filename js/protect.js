(function () {
  // 🔒 Bloqueio de teclas comuns
  document.addEventListener("keydown", function (e) {
    const k = e.key.toLowerCase();
    // Bloqueia Ctrl/Cmd + teclas específicas e atalhos do DevTools
    if (
      (e.ctrlKey || e.metaKey) &&
      ["s", "u", "p", "a", "c", "x", "i", "j"].includes(k)
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j"].includes(k))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // 🖱️ Bloqueia clique direito, cópia e seleção, exceto em inputs
  document.addEventListener("contextmenu", (e) => {
    if (!e.target.closest("input, textarea")) {
      e.preventDefault();
    }
  });
  document.addEventListener("copy", (e) => {
    if (!e.target.closest("input, textarea")) {
      e.preventDefault();
    }
  });
  document.addEventListener("cut", (e) => {
    if (!e.target.closest("input, textarea")) {
      e.preventDefault();
    }
  });
  document.addEventListener("selectstart", (e) => {
    if (!e.target.closest("input, textarea")) {
      e.preventDefault();
    }
  });
  document.addEventListener("dragstart", (e) => {
    if (!e.target.closest("input, textarea")) {
      e.preventDefault();
    }
  });

  // 🤖 Bloqueia bots por user-agent
  const bots = [
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /duckduckbot/i,
    /facebookexternalhit/i,
    /facebot/i,
    /slackbot/i,
    /discordbot/i,
    /telegrambot/i,
    /whatsapp/i,
    /twitterbot/i,
    /linkedinbot/i,
    /instagram/i,
  ];
  const userAgent = navigator.userAgent.toLowerCase();
  if (bots.some((bot) => bot.test(userAgent))) {
    document.documentElement.innerHTML = "<h1>Acesso negado</h1>";
    throw new Error("Bot detectado.");
  }

  // 🧱 Proteção contra scraping excessivo
  let reqCount = 0;
  const maxRequests = 40; // Configurável
  const resetInterval = 10000; // 10 segundos para resetar
  const _fetch =
    window.fetch || (() => Promise.reject(new Error("Fetch não suportado")));
  window.fetch = function () {
    reqCount++;
    if (reqCount > maxRequests) {
      console.warn("Limite de requisições excedido. Bloqueando...");
      destroy();
    }
    return _fetch.apply(this, arguments);
  };
  const _xhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    reqCount++;
    if (reqCount > maxRequests) {
      console.warn("Limite de requisições excedido. Bloqueando...");
      destroy();
    }
    return _xhrOpen.apply(this, arguments);
  };
  setInterval(() => {
    reqCount = 0;
  }, resetInterval);

  // 🚫 Destrói o conteúdo se scraping for detectado
  function destroy() {
    document.documentElement.innerHTML =
      "<h1>Site bloqueado por atividade suspeita.</h1><p>Tente novamente mais tarde.</p>";
    if (typeof window.stop === "function") {
      window.stop();
    }
  }
})();
