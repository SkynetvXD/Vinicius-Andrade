/* ==========================================================================
   VINÍCIUS ANDRADE — PSICOTERAPIA ONLINE
   JavaScript vanilla — sem dependências externas
   ========================================================================== */
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

    // fecha o menu ao clicar em um link
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

  if (form) {
    // marca campos como "tocados" para exibir validação apenas após interação
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        field.classList.add("touched");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        // ativa a validação nativa do navegador (mensagens em português do sistema)
        form.reportValidity();
        form.querySelectorAll("input, select, textarea").forEach(function (field) {
          field.classList.add("touched");
        });
        statusEl.textContent =
          "Confira os campos obrigatórios destacados antes de enviar.";
        statusEl.className = "form-status is-error";
        return;
      }

      var actionUrl = form.getAttribute("action") || "";
      if (actionUrl.indexOf("SEU_FORM_ID") !== -1) {
        // Lembrete para quem está configurando o site pela primeira vez.
        statusEl.textContent =
          "Configuração pendente: defina o endpoint de envio (Formspree/FormSubmit) em index.html antes de publicar. Veja o README.md.";
        statusEl.className = "form-status is-error";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
      statusEl.textContent = "";
      statusEl.className = "form-status";

      var formData = new FormData(form);

      fetch(actionUrl, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            statusEl.textContent =
              "Recebi suas informações. Em breve entro em contato pelo WhatsApp ou e-mail informado.";
            statusEl.className = "form-status is-success";
            pushEvent("form_submit_success", "pre_atendimento");
            form.reset();
            if (availGrid) {
              availGrid.classList.remove("is-disabled");
              availGrid.querySelectorAll('input[type="checkbox"]').forEach(function (i) {
                i.disabled = false;
              });
            }
            form.querySelectorAll(".touched").forEach(function (f) {
              f.classList.remove("touched");
            });
          } else {
            return response.json().then(function (data) {
              throw new Error(
                (data && data.error) || "Não foi possível enviar o formulário."
              );
            });
          }
        })
        .catch(function () {
          statusEl.textContent =
            "Não foi possível enviar agora. Tente novamente ou fale comigo diretamente pelo WhatsApp.";
          statusEl.className = "form-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Quero iniciar minha terapia";
        });
    });
  }
})();
