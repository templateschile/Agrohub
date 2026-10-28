# AgroHubs: sitio web

## Textos y diseño
- Todo texto que vea una persona (sitio, correos, mensajes, PR) pasa por la skill `no-ai-slop`
  (`.claude/skills/no-ai-slop`, de github.com/petergyang/no-ai-slop, licencia MIT): sin frases de relleno,
  sin «no es X, es Y», sin revelaciones con dos puntos, sin emojis como títulos, sin guiones largos.
  Antes de entregar, revisa el texto con `eval.md`.
- El diseño sigue Hallmark (github.com/Nutlope/hallmark) con el tema Wayfind que ya está en `src/tokens.css`
  y `src/sitio.css`; el sello de Hallmark va al inicio de `src/index.css`.
