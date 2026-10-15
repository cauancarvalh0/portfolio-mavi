# Portfólio profissional | Maria Vitória (dois lados)

Site estático em Bootstrap 5, HTML, CSS e JavaScript, seguindo o Brex Design System (fundo branco, Inter, uma única cor de destaque).

## Dois lados

O site tem duas versões do conteúdo: **Biomedicina** e **Administração**. O visitante alterna pelo botão duplo no topo (ou pelos convites "Ver meu outro lado"). A escolha fica salva no navegador e também pode ser aberta direto por `index.html?lado=adm`.

## O que preencher

1. `js/script.js`, bloco `CONFIG` no topo: e-mail, LinkedIn, Instagram e WhatsApp. Links vazios ficam escondidos.
2. `index.html`: procure por "Nome da instituição · Período" (seção Formação) e pelos textos "Título do momento" (seção Momentos).
3. Fotos dos dois lados: pasta `img/` (veja `img/LEIA-ME.txt`). Não precisa mexer no HTML.
4. Vídeo de fundo, um por lado: `video/fundo.mp4` e `video/fundo-adm.mp4` (veja `video/LEIA-ME.txt`).
5. Lado administrativo: revisar os textos de "Áreas de atuação" e do "Sobre", que partem das qualidades informadas.

## Estrutura

    portfolio-maria-vitoria/
    ├── index.html
    ├── css/ (brex.css, bootstrap-overrides.css, style.css)
    ├── js/script.js
    ├── img/
    └── video/

## Publicar

Netlify (arrastar a pasta) ou InfinityFree (enviar o conteúdo para `htdocs` por FTP).
