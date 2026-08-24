/**
 * VINÍCIUS ANDRADE — PSICOTERAPIA ONLINE
 * Google Apps Script — recebe o formulário de pré-atendimento do site
 * estático (GitHub Pages) e envia um e-mail com os dados do lead.
 *
 * Como publicar (passo a passo completo no README.md do projeto):
 *   1. script.google.com → Novo projeto → apague o conteúdo padrão e
 *      cole todo este arquivo.
 *   2. Ajuste, se quiser, o e-mail de destino na constante abaixo.
 *   3. Deploy → Nova implantação → tipo "App da Web".
 *        Executar como: Eu (sua conta)
 *        Quem tem acesso: Qualquer pessoa
 *   4. Copie a URL gerada (termina em /exec) e cole em
 *      assets/js/script.js, na constante SCRIPT_URL.
 */

var EMAIL_DESTINO = "andradepereira.contato@gmail.com";

function doPost(e) {
  try {
    var dados = parseRequestData(e);
    var assunto = "NOVO LEAD — PSICOTERAPIA ONLINE";
    var corpo = montarCorpoEmail(dados);

    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: assunto,
      body: corpo,
    });

    return respostaJson({ status: "ok" });
  } catch (erro) {
    return respostaJson({ status: "erro", mensagem: String(erro) });
  }
}

function parseRequestData(e) {
  // O site envia o corpo como texto (JSON.stringify) para evitar
  // bloqueios de CORS — por isso lemos de e.postData.contents.
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fallback: formulário enviado como x-www-form-urlencoded
    }
  }
  return (e && e.parameter) || {};
}

function montarCorpoEmail(d) {
  function campo(nome) {
    return d[nome] || "—";
  }

  var linhas = [
    "NOVO LEAD — PSICOTERAPIA ONLINE",
    "",
    "Nome: " + campo("Nome completo"),
    "WhatsApp: " + campo("WhatsApp"),
    "E-mail: " + campo("E-mail"),
    "Idade: " + campo("Idade"),
    "Cidade: " + campo("Cidade/Estado"),
    "Demanda: " + campo("Tema principal"),
    "Descrição: " + campo("Descrição"),
    "Já fez terapia: " + campo("Já fez terapia"),
    "Quando deseja iniciar: " + campo("Quando deseja iniciar"),
    "Faixa de investimento: " + campo("Faixa de investimento"),
    "",
    "DISPONIBILIDADE:",
    "Segunda: " + campo("Segunda"),
    "Terça: " + campo("Terça"),
    "Quarta: " + campo("Quarta"),
    "Quinta: " + campo("Quinta"),
    "Sexta: " + campo("Sexta"),
    "Sábado: " + campo("Sábado"),
    "Disponibilidade variável: " + campo("Disponibilidade variável"),
    "Outro horário: " + campo("Outro horário"),
    "",
    "Origem da página: " + campo("Origem da página"),
  ];

  return linhas.join("\n");
}

function respostaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
