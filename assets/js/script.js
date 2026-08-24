/* ==========================================================================
   VINÍCIUS ANDRADE — PSICOTERAPIA ONLINE
   JavaScript vanilla — sem dependências externas
   ========================================================================== */

/* ============================================================
   ENDEREÇO DO GOOGLE APPS SCRIPT — configuração obrigatória.

   Depois de publicar o Apps Script como Web App (veja o código
   em apps-script/Code.gs e o passo a passo no README.md), cole
   aqui a URL que termina em /exec.
   ============================================================ */
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiuT5RE9FIe6if8Rf_oPi50mtxXVPOubj8ZL-6TCoDDNQLfbXWmcDuk5n7T1-pT3f3Zw/exec";

(function () {
  "use strict";

  /* -------------------------- ano automático no rodapé -------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------- menu mobile ---------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* ------------------------ disponibilidade variável ----------------------------- */
  var dispVariavel = document.getElementById("dispVariavel");
  var availGrid = document.getElementById("availGrid");

  if (dispVariavel && availGrid) {
    dispVariavel.addEventListener("change", function () {
      availGrid.classList.toggle("is-disabled", dispVariavel.checked);
      var slotInputs = availGrid.querySelectorAll('input[type="checkbox"]');
      slotInputs.forEach(function (input) {
        input.disabled = dispVariavel.checked;
        if (dispVariavel.checked) input.checked = false;
      });
    });
  }

  /* --------------------------- eventos de conversão ------------------------------
     Envia eventos para o dataLayer (Google Tag Manager / GA4), se estiver
     carregado na página. Não gera erro caso o GTM/GA4 ainda não tenha sido
     configurado — funciona como um "stub" seguro.
  --------------------------------------------------------------------------- */
  function pushEvent(eventName, label) {
    if (typeof window.dataLayer !== "undefined") {
      window.dataLayer.push({
        event: eventName,
        cta_label: label || "",
      });
    }
  }

  document.querySelectorAll("[data-event]").forEach(function (el) {
    el.addEventListener("click", function () {
      pushEvent(el.getAttribute("data-event"), el.getAttribute("data-label"));
    });
  });

  /* --------------------------------- formulário ----------------------------------- */
  var form = document.getElementById("preAtendimentoForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("formSubmitBtn");
  var origemInput = document.getElementById("origemPagina");

  // registra de onde a pessoa veio (útil para saber se o lead chegou via
  // Google Ads, orgânico, Instagram etc.)
  if (origemInput) {
    origemInput.value = document.referrer || "Acesso direto";
  }

  // dias da semana usados no calendário de disponibilidade
  var DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  function resetTouchedState() {
    form.querySelectorAll(".touched").forEach(function (f) {
      f.classList.remove("touched");
    });
  }

  function resetAvailability() {
    if (!availGrid) return;
    availGrid.classList.remove("is-disabled");
    availGrid.querySelectorAll('input[type="checkbox"]').forEach(function (i) {
      i.disabled = false;
    });
  }

  if (form) {
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        field.classList.add("touched");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // honeypot: se o campo invisível foi preenchido, é um bot —
      // finge sucesso sem enviar nada.
      var honeypot = document.getElementById("honeypot");
      if (honeypot && honeypot.value) {
        statusEl.textContent =
          "Recebi suas informações. Em breve entro em contato.";
        statusEl.className = "form-status is-success";
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        form.querySelectorAll("input, select, textarea").forEach(function (field) {
          field.classList.add("touched");
        });
        statusEl.textContent =
          "Confira os campos obrigatórios destacados antes de enviar.";
        statusEl.className = "form-status is-error";
        return;
      }

      if (!SCRIPT_URL || SCRIPT_URL.indexOf("COLE_AQUI") !== -1) {
        statusEl.textContent =
          "Configuração pendente: defina SCRIPT_URL em assets/js/script.js antes de publicar. Veja o README.md.";
        statusEl.className = "form-status is-error";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
      statusEl.textContent = "";
      statusEl.className = "form-status";

      var formData = new FormData(form);
      var payload = {};

      formData.forEach(function (value, key) {
        if (DIAS_SEMANA.indexOf(key) !== -1) return; // tratado à parte abaixo
        payload[key] = value;
      });

      // disponibilidade: cada dia pode ter vários horários marcados
      DIAS_SEMANA.forEach(function (dia) {
        var valores = formData.getAll(dia);
        payload[dia] = valores.length ? valores.join(", ") : "—";
      });

      // Envio em text/plain evita o preflight de CORS, que o Apps Script
      // não responde de forma confiável. Por isso usamos mode: "no-cors":
      // a requisição é entregue e processada no servidor (o e-mail é
      // enviado), mas o navegador não deixa a página ler a resposta —
      // por isso tratamos qualquer envio sem erro de rede como sucesso.
      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      })
        .then(function () {
          statusEl.textContent =
            "Recebi suas informações. Vou analisar e entrar em contato pelo e-mail ou WhatsApp informado.";
          statusEl.className = "form-status is-success";
          pushEvent("form_submit_success", "pre_atendimento");
          form.reset();
          resetAvailability();
          resetTouchedState();
          if (origemInput) origemInput.value = document.referrer || "Acesso direto";
        })
        .catch(function () {
          statusEl.textContent =
            "Não foi possível enviar agora por uma falha de conexão. Tente novamente em instantes.";
          statusEl.className = "form-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Quero iniciar minha terapia";
        });
    });
  }
})();
