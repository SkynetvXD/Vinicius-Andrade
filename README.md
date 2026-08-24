# Landing page — Vinícius Andrade, Psicólogo

Site estático (HTML/CSS/JS puro), pronto para publicar no GitHub Pages. O envio do formulário vai direto para o seu e-mail via Google Apps Script — o mesmo esquema usado na landing page da Lumi Match, sem depender de nenhum serviço de terceiros.

```
psicoterapia-landing/
├── index.html
├── README.md
├── apps-script/
│   └── Code.gs            (cole no script.google.com)
└── assets/
    ├── css/style.css
    ├── js/script.js
    └── img/
        ├── vinicius-andrade.jpg
        └── favicon.svg
```

O contato com pacientes acontece **somente pelo formulário** — não há botão de WhatsApp nem link de Instagram na página.

Antes de publicar, há **2 configurações obrigatórias**.

---

## 1. Publicar o Google Apps Script (obrigatório)

É ele quem recebe os dados do formulário e envia o e-mail para você.

1. Acesse **script.google.com** (com a mesma conta Google que recebe `andradepereira.contato@gmail.com`, ou ajuste o e-mail de destino no passo 2).
2. Clique em **Novo projeto**.
3. Apague o conteúdo padrão (`function myFunction() {...}`) e cole todo o conteúdo do arquivo `apps-script/Code.gs` deste projeto.
4. Se quiser enviar para um e-mail diferente, edite a linha no topo do arquivo:
   ```javascript
   var EMAIL_DESTINO = "andradepereira.contato@gmail.com";
   ```
5. Salve o projeto (nomeie como "Pré-atendimento — site").
6. Clique em **Implantar → Nova implantação**.
7. Em **Tipo**, escolha **App da Web**.
8. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem tem acesso:** Qualquer pessoa
9. Clique em **Implantar**. Na primeira vez, o Google vai pedir para você autorizar o script a enviar e-mails em seu nome — autorize.
10. Copie a **URL do app da Web** (termina em `/exec`).
11. Abra `assets/js/script.js`, procure pela linha no topo:
    ```javascript
    var SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
    ```
    e substitua `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL copiada.

**Testando:** depois de publicar o site (passo 2), preencha o formulário de teste. O e-mail deve chegar em poucos segundos com o assunto "NOVO LEAD — PSICOTERAPIA ONLINE".

> **Nota técnica:** o navegador não consegue confirmar programaticamente se o Apps Script processou a requisição com sucesso (limitação de CORS do próprio Apps Script), então o site mostra a mensagem de sucesso assim que o envio sai do navegador sem erro de rede. Por isso é importante fazer o teste real ao publicar, para confirmar que o e-mail está chegando.

> Se um dia quiser alterar o formato do e-mail (campos, ordem, texto), edite a função `montarCorpoEmail` dentro de `Code.gs` e reimplante (**Implantar → Gerenciar implantações → editar → Nova versão**).

---

## 2. Publicar no GitHub Pages (obrigatório)

1. Crie um repositório novo no GitHub (público), por exemplo `psicoterapia-landing`.
2. Envie os arquivos desta pasta para o repositório:
   - Pelo site do GitHub: **Add file → Upload files** → arraste todos os arquivos e pastas (`index.html`, `README.md`, `apps-script/`, `assets/`) → **Commit changes**.
   - Ou pelo terminal:
     ```bash
     git init
     git add .
     git commit -m "primeira versão da landing page"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/psicoterapia-landing.git
     git push -u origin main
     ```
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde 1–2 minutos. O GitHub vai exibir a URL do site, algo como:
   `https://seu-usuario.github.io/psicoterapia-landing/`
6. Volte ao `index.html` e atualize as tags `<link rel="canonical">` e `<meta property="og:image">` no `<head>` com essa URL final (estão marcadas com `▲` no comentário).

---

## 3. Google Analytics 4 / Google Tag Manager / Google Ads (opcional)

No `<head>` do `index.html` há dois blocos comentados — um para **GTM** e um para **GA4**. Use apenas um dos dois.

1. Remova os comentários `<!--` / `-->` do bloco escolhido.
2. Substitua `GTM-XXXXXXX` (ou `G-XXXXXXXXXX`) pelo ID real da sua conta.
3. Eventos de conversão já preparados em `script.js` (disparam automaticamente para `dataLayer`, sem gerar erro se o GTM ainda não estiver instalado):
   - `cta_click` — clique em qualquer botão principal
   - `form_submit_success` — envio bem-sucedido do formulário de pré-atendimento
4. No Google Ads, crie as ações de conversão apontando para esses eventos dentro do GTM.

---

## 4. Editar o texto de investimento/preço

Como você pediu para não inventar um valor fixo, o texto atual (no formulário e no FAQ) diz que o investimento é combinado após o contato inicial. Se quiser deixar um valor fixo, procure esse trecho em `index.html` (aparece duas vezes) e substitua.

---

## 5. Trocar a foto

Basta substituir `assets/img/vinicius-andrade.jpg` por outro arquivo com o mesmo nome (ideal: quadrada, mínimo 480×480px).

---

## Checklist antes de divulgar o link

- [ ] Apps Script implantado e `SCRIPT_URL` configurado em `script.js`
- [ ] Teste real do formulário feito — e-mail chegou na caixa de entrada
- [ ] URL final do GitHub Pages atualizada no `<head>` (canonical + og:image)
- [ ] GA4/GTM configurado, se for usar em campanhas
- [ ] Testado no celular: menu, formulário e calendário de disponibilidade

---

## Sobre as escolhas de conteúdo

Por pedido do briefing original, o site evita: promessas de cura ou resultado garantido, linguagem de urgência ("últimas vagas", "agende já"), estética infantil ou de clínica médica, e ícones clichê. O formulário coleta apenas as informações necessárias para a triagem inicial — nenhuma informação clínica detalhada é solicitada nesta etapa. O contato com pacientes acontece exclusivamente pelo formulário, sem botão de WhatsApp ou link de Instagram na página.
