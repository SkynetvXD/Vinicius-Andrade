# Landing page — Vinícius Andrade, Psicólogo

Site estático (HTML/CSS/JS puro), pronto para publicar no GitHub Pages.

```
psicoterapia-landing/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/script.js
    └── img/
        ├── vinicius-andrade.jpg   (sua foto)
        └── favicon.svg
```

Antes de publicar, existem **4 configurações obrigatórias** e 2 opcionais. Todas estão marcadas com comentários `◄` diretamente no código.

---

## 1. Configurar o envio do formulário (obrigatório)

O site é 100% estático — não há servidor próprio, então o envio por e-mail depende de um serviço externo. Recomendo o **Formspree** (grátis até 50 envios/mês, suficiente para começar).

**Passo a passo:**

1. Acesse https://formspree.io e crie uma conta gratuita.
2. Clique em **"New Form"**, dê um nome (ex.: "Pré-atendimento") e confirme o e-mail `andradepereira.contato@gmail.com` como destinatário.
3. O Formspree vai gerar um endpoint como `https://formspree.io/f/xandwxyz`. Copie o código depois de `/f/` (no exemplo, `xandwxyz`).
4. Abra `index.html`, procure por:
   ```html
   action="https://formspree.io/f/SEU_FORM_ID"
   ```
   e substitua `SEU_FORM_ID` pelo código copiado.
5. Publique o site (veja seção 3) e envie um teste pelo formulário — o Formspree pede uma confirmação de e-mail no primeiro envio.

**Alternativa: FormSubmit** (não exige criar conta)
Troque a linha `action` por:
```html
action="https://formsubmit.co/andradepereira.contato@gmail.com"
```
E adicione este campo oculto logo abaixo de `<input type="hidden" name="_subject" ...>`:
```html
<input type="hidden" name="_captcha" value="false">
```
Funciona de forma parecida, mas o e-mail de confirmação do primeiro envio é obrigatório também.

> O JavaScript (`script.js`) já está preparado para enviar os dados via `fetch`, mostrar a mensagem de sucesso na própria página (sem redirecionar) e reativar o botão em caso de erro.

---

## 2. Configurar o número de WhatsApp (obrigatório)

Aparece em **dois lugares**: o botão flutuante e o rodapé.

No `index.html`, procure pelas duas ocorrências de:
```
https://wa.me/5521XXXXXXXXX?text=...
```
Substitua `5521XXXXXXXXX` pelo seu número completo, no formato DDI + DDD + número, sem espaços, traços ou parênteses (ex.: `5521987654321`).

---

## 3. Publicar no GitHub Pages (obrigatório)

1. Crie um repositório novo no GitHub (público), por exemplo `psicoterapia-landing`.
2. Envie os arquivos desta pasta para o repositório. Pelo site do GitHub:
   - Abra o repositório → **Add file → Upload files** → arraste todos os arquivos e pastas (`index.html`, `README.md`, `assets/`) → **Commit changes**.
   - Ou, pelo terminal:
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
6. Volte ao `index.html` e atualize as duas tags `<link rel="canonical">` e `<meta property="og:image">` no `<head>` com essa URL final (estão marcadas com `▲` no comentário).

---

## 4. Google Analytics 4 / Google Tag Manager / Google Ads (opcional, para quando for rodar campanhas)

No `<head>` do `index.html` há dois blocos comentados — um para **GTM** e um para **GA4**. Use **apenas um dos dois** (o mais comum é o GTM, que depois permite adicionar GA4 e Google Ads por dentro dele sem mexer no código de novo).

1. Remova os comentários `<!--` / `-->` do bloco escolhido.
2. Substitua `GTM-XXXXXXX` (ou `G-XXXXXXXXXX`) pelo ID real da sua conta.
3. Eventos de conversão já preparados no `script.js` (disparam automaticamente para `dataLayer`, sem gerar erro se o GTM ainda não estiver instalado):
   - `cta_click` — clique em qualquer botão principal ("Quero conversar sobre meu caso" etc.)
   - `whatsapp_click` — clique no botão do WhatsApp (flutuante ou rodapé)
   - `form_submit_success` — envio bem-sucedido do formulário de pré-atendimento
4. No Google Ads, crie as ações de conversão apontando para esses eventos dentro do GTM, e insira o **Conversion ID / Label** conforme a interface do Google Ads indicar (não há necessidade de editar o código para isso).

---

## 5. Editar o texto de investimento/preço

Você pediu para não inventar um valor fixo. O texto atual (dentro do formulário e no FAQ) diz:

> "O investimento é definido de acordo com a modalidade e frequência do acompanhamento..."

Se quiser deixar um valor fixo no futuro, procure por esse trecho em `index.html` (aparece duas vezes: na seção do formulário e no FAQ) e substitua pelo texto/valor que preferir.

---

## 6. Trocar a foto

Basta substituir o arquivo `assets/img/vinicius-andrade.jpg` por outro com o mesmo nome (ideal: quadrada, mínimo 480×480px). Se usar outro nome de arquivo, atualize a tag `<img src="...">` na seção Hero do `index.html`.

---

## Checklist antes de divulgar o link

- [ ] Endpoint do Formspree/FormSubmit configurado e testado (envio de teste chegou no e-mail)
- [ ] Número de WhatsApp atualizado nos dois lugares
- [ ] URL final do GitHub Pages atualizada no `<head>` (canonical + og:image)
- [ ] GA4/GTM configurado, se for usar em campanhas
- [ ] Testado no celular: menu, formulário e calendário de disponibilidade

---

## Sobre as escolhas de conteúdo

Por pedido do briefing original, o site evita: promessas de cura ou resultado garantido, linguagem de urgência ("últimas vagas", "agende já"), estética infantil ou de clínica médica, e ícones clichê. O formulário coleta apenas as informações necessárias para a triagem inicial — nenhuma informação clínica detalhada é solicitada nesta etapa.
