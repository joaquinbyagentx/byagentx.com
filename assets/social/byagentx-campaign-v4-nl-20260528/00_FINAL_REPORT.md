# ByAgentX — Campaña V4 "NON-LATINO" · REPORTE FINAL (BORRADOR PRIVADO)
## Big idea (sin cambios): "El cliente no espera. Tu negocio tampoco debería."

**Estado:** Borrador privado, listo para revisión de Jose.
**NO** se publicó · **NO** se agendó · **NO** se tocó Meta Ads · **NO** se modificó presupuesto · **NO** se contactaron leads.

Carpeta raíz:
`/Users/josecortesmacmini2/.hermes/profiles/creative-director/workspace/campaigns/byagentx-creative-campaign-v4-nonlatino-video/`

---

## 1. QUÉ CAMBIÓ VS V2 (feedback de Jose)

Jose: le gustó la dirección/estilo del video humano de V2, pero pidió **"igual no quiero latinos"**. Además el job de V3 (posts non-latino) **no dejó archivos** (su carpeta quedó vacía), así que aquí regenero **video Y posts** con look non-latino.

| Aspecto | V2 (anterior) | V4 (esta entrega) |
|---|---|---|
| **Look humano** | Dueños/operadores mexicanos/latinos | **Northern-European / Germanic / Scandinavian premium**: piel clara, rasgos europeos, cabello rubio/castaño claro, wardrobe minimalista refinado, energía de founder/operator calmado |
| **Video** | Footage humano latino | **Footage humano nuevo Northern-European** (Veo 3.1), mismo arco e idéntica edición |
| **Posts** | 6 posts con personas latinas | 6 posts nuevos con plates Northern-European |
| **Reutilización del footage V2** | — | **CERO**. El video y fotos V2 se usaron solo como referencia de estilo/composición. Todo el footage y fotos son **nuevos**. |
| **Arco / copy / VO / overlays / subtítulos** | — | **Idénticos a V2** (no tenían carga étnica): mismo guión, misma voz ES-MX, mismos textos legibles. La dirección visual cambió; el copy NO menciona etnicidad. |

> La etnicidad se trató **solo como dirección visual de casting**. Ningún texto, copy, caption ni overlay menciona origen, raza ni nacionalidad.

---

## 2. PROVENANCE (origen de cada activo) — honestidad total

- **Footage del video → GENERADO NUEVO con Google Veo 3.1** (`veo-3.1-fast-generate-preview`, vía Gemini API), 3 clips 9:16. Personas **generadas por IA** con dirección Northern-European, no personas reales de ByAgentX.
- **Fotos de los posts → GENERADAS NUEVAS** con `gpt-image-1` (alta calidad), 6 plates verticales sin texto. También personas generadas por IA.
- **Texto, overlays, subtítulos, chips de canal, CTA y wordmark → COMPOSITE LOCAL** (PIL/ffmpeg), reutilizados de V2. Regla anti-garble respetada: **nada de UI/texto generado por IA dentro de imagen o video**.
- **Voz en off → reutilizada de V2** (ElevenLabs, español MX). El guión no cambió.
- **NO se reutilizó** ningún frame/foto con personas latinas. El footage V2 sirvió solo como referencia de dirección.

### Nota de proveedor
- **FAL sigue sin saldo** (`FAL_KEY` vacío) → se usó la ruta Veo 3.1 vía Gemini API, igual que en V2. Funcionó.
- **Veo: clip3 (payoff) falló** en la primera pasada con error interno 13 del servidor de Gemini. Se **reenvió** y completó en el segundo intento. Los otros dos clips salieron a la primera. **No** hubo fallback a slides ni a footage latino.

---

## 3. ENTREGABLES

### A) Video humano 9:16 NON-LATINO (entregable principal)
`video/ByAgentX_ElClienteNoEspera_NL_9x16.mp4`
- **1080x1920, H.264 High, yuv420p, 30 fps, 13.84 s, AAC estéreo 48 kHz, ~7.9 MB.**
- **Telegram-safe verificado:** H.264/AAC/yuv420p + **faststart confirmado** (moov@36 antes de mdat@16658).
- Audio presente (mean −15.8 dB / max −3.8 dB).
- **3 escenas humanas Northern-European:** (1) dueña rubia preocupada con su teléfono → (2) operador en control, glow de mensajes → (3) trato cerrado con apretón de manos.
- VO español MX + subtítulos legibles abajo + headlines kinéticos arriba (sin colisión) + chips WhatsApp/IG/Face/Web + CTA "Agenda tu demo gratis".
- Oferta clara en los primeros 3 s.
- QA visual: `video/verify/contact_sheet.png`, `video/verify/thumbnail.png`.

### B) Posts de imagen NON-LATINO (6, premium, diferenciados)
- `images/post1_hero_elcliente_1080x1350.jpg` — HERO "El cliente no espera."
- `images/post3_alivio_1080x1350.jpg` — "No vivas pegado al celular." + CTA
- `images/post4_omnicanal_1080x1350.jpg` — "Todos tus canales. Un solo agente." + chips
- `images/post6_seguimiento_1080x1350.jpg` — "La venta se cierra en el seguimiento."
- `images/post7_24-7_1080x1350.jpg` — "Tu negocio cierra. AgentX no." + CTA
- `images/post8_story_manifiesto_1080x1920.jpg` — STORY/COVER manifiesto + CTA
- QA: `images/_contact_sheet_posts.png`

### C) Fuentes / pipeline reproducible
- `video/clips/clip1_hook.mp4`, `clip2_control.mp4`, `clip3_payoff.mp4` — Veo 3.1 crudo (non-latino).
- `raw/plate_*.png` — 6 fotos base gpt-image-1 (sin texto) + `raw/_plates_qa.png`.
- `overlays/`, `audio/vo_full.mp3` — reutilizados de V2 (texto/voz, sin carga étnica).
- `scripts/veo_gen.py`, `make_plates.py`, `make_posts.py`, `assemble_video.sh`, `make_overlays.py`, `make_subs.py`, `resub_clip3.py`.

---

## 4. LISTA DE ARCHIVOS GENERADOS (review-ready)

Video:
- video/ByAgentX_ElClienteNoEspera_NL_9x16.mp4

Imágenes:
- images/post1_hero_elcliente_1080x1350.jpg
- images/post3_alivio_1080x1350.jpg
- images/post4_omnicanal_1080x1350.jpg
- images/post6_seguimiento_1080x1350.jpg
- images/post7_24-7_1080x1350.jpg
- images/post8_story_manifiesto_1080x1920.jpg

QA:
- video/verify/contact_sheet.png · video/verify/thumbnail.png
- images/_contact_sheet_posts.png · raw/_plates_qa.png

---

## 5. QA NOTES

- ✅ **Look NON-LATINO confirmado por revisión visual** en los 3 clips de video y los 6 plates: piel clara, rasgos Northern-European, cabello rubio/castaño claro, wardrobe premium minimalista. Ninguna persona lee como latina.
- ✅ **Humanos visibles** todo el video. No slides, no text-only.
- ✅ Video verificado con **ffprobe**: 1080x1920 H.264 High, yuv420p, 30fps, 13.84s, AAC estéreo, faststart OK.
- ✅ Headlines (arriba) y subtítulos (abajo) **no se traslapan** en el video.
- ✅ Cero UI/dashboards/texto legibles generados por IA. Teléfonos = solo glow abstracto.
- ✅ Ortografía español MX correcta. Oferta clara en primeros 3 s.
- ⚠️ **Post3 y Post4:** el sub-headline / chips de canal caen sobre el rostro del modelo (los plates quedaron con el sujeto muy centrado). Es **legible**, pero estéticamente no ideal. Si molesta, regenero esos 2 plates con más aire arriba o reubico el texto. (Decisión de Jose.)

---

## 6. CAVEATS / PRÓXIMAS MEJORAS

1. **Personas generadas por IA:** ni el video ni las fotos son clientes/empleados reales. Para máxima autenticidad, sustituir por footage/fotos reales.
2. **Logo oficial ByAgentX:** wordmark provisional "ByAgentX". Sustituir por el logo real antes de publicar.
3. **Destino del CTA:** definir link real (WhatsApp/Calendly/landing). Hoy es solo texto.
4. **Paleta de marca:** si hay HEX oficiales, ajusto teal/violeta a match exacto.
5. **Sin claims inventados:** sin precios, garantías, cifras, testimonios ni logos de terceros.
6. **Música:** el video lleva solo VO. Puedo añadir bed musical con licencia si se desea.
7. **Reencuadre opcional posts 3/4** (ver QA ⚠️).
8. **FAL sin saldo:** recargar fal.ai si se quiere Veo vía FAL; Gemini Veo 3.1 funciona bien por ahora.

---

## 7. PRÓXIMO PASO
Revisión de Jose → confirmar si el look Northern-European está OK → (opcional) reencuadrar posts 3/4 → confirmar wordmark/paleta/link CTA → con aprobación, cortar versión 15s para ads y variantes A/B.
