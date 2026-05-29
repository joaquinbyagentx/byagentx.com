# ByAgentX — V5 Remake · FINAL REPORT

**Esto es un REMAKE COMPLETO, no un parche de V1–V4.**
Todo el footage humano, los keyframes y los posts son **nuevos**, generados en esta corrida.

---

## ¿El footage del video es nuevo? SÍ.
Footage humano **nuevo, generado en esta corrida** con **Google Veo 3.1**
(image-to-video). No se reusó nada de V2/V3/V4 como asset final.

---

## Qué cambió vs. intentos previos
| Problema previo | Corrección en V5 |
|---|---|
| V1 = slides / solo texto | V5 = footage humano real (Veo 3.1), 5 tomas con personas |
| V2 video = personas con apariencia latina | V5 controla el casting en el origen: stills art-dirigidos (GPT Image 2 High) con casting nórdico/europeo, **verificados con visión**, luego animados con I2V — el modelo de video NO inventa el casting |
| V3/V4 = se quedaron sin generar imágenes/clips | V5 entrega 6 posts finales + 1 video final ensamblado y verificado |
| FAL sin saldo | Fallback a **Veo 3.1** (ruta de la marca), documentado |

## Pipeline (provenance)
1. **Keyframes** (5): `GPT Image 2 High`, 9:16, casting nórdico/europeo.
   Verificados uno a uno con visión antes de animar.
2. **Clips** (5): `Veo 3.1` image-to-video desde cada keyframe (preserva el casting).
   - 4 clips vía `veo-3.1-fast-generate-preview`.
   - `kf2_founder_man` vía `veo-3.1-generate-preview` (el fast dio filtro RAI de audio + 429; se reintentó en el modelo estándar y salió limpio).
3. **VO**: `ElevenLabs` (voz configurada del perfil), español MX, 20.5s.
4. **Overlays/subtítulos**: **PNG locales con PIL** compuestos con ffmpeg `overlay`.
   (El ffmpeg de este host NO trae libass, así que NO se usó `subtitles=`; el texto
   legible es 100% local, cumple el requisito de no usar texto generado por IA.)
5. **Encode final**: H.264 High / yuv420p / AAC 48k stereo / faststart / 9:16.

## QA — Video (ffprobe verificado)
- Códec: **h264 High @ L4.0**, pix_fmt **yuv420p**
- Resolución: **1080x1920 (9:16)**
- Audio: **AAC-LC, 48000 Hz, stereo, 192k**
- Duración: **20.53s** · Tamaño: **9.5 MB**
- **faststart: OK** (moov antes de mdat) → Telegram-safe ✅
- Casting verificado con visión en los 5 clips: piel clara, rasgos europeos, sin distorsión.
- Subtítulos legibles, ortografía MX correcta (tarde, regresa, ti, canales, ocupado).

## QA — Posts (6)
- 5 feed **1080x1350** + 1 story/reel cover **1080x1920**.
- Mismas personas / dirección de arte nórdica-europea, visualmente diferenciados.
- Texto local PIL, acentos correctos (debería), CTA chip + wordmark consistentes.
- Sin precios, testimonios, logos de clientes, métricas ni clientes inventados.

## Lista de archivos
```
byagentx_v5_reel_9x16.mp4        ← VIDEO FINAL (Telegram-safe)
byagentx_v5_thumbnail.png        ← thumbnail
byagentx_v5_contact_sheet.png    ← contact sheet (6 frames)
posts/post1_hook_1080x1350.png
posts/post2_solution_1080x1350.png
posts/post3_channels_1080x1350.png
posts/post4_benefit_1080x1350.png
posts/post5_howitworks_1080x1350.png
posts/post6_story_cover_1080x1920.png
audio/vo_full.mp3                ← VO español MX
video/keyframes/*.png            ← 5 stills fuente (casting verificado)
video/clips/*.mp4                ← 5 clips Veo 3.1
overlays/beat1..6.png            ← overlays locales
scripts/                         ← veo_i2v.py, make_posts.py, make_overlays.py, assemble.sh
01_CAMPAIGN_CONCEPT.md           ← concepto, captions, CTA, hashtags
00_FINAL_REPORT.md               ← este archivo
```

## Caveats (honestos)
- **Casting = solo art direction interna.** Ningún copy público menciona etnicidad.
- Prop ambiental incidental en la oficina del founder (texto borroso tipo "NORTHWIND"):
  es decoración de set, **no** es claim ni logo de cliente de ByAgentX. Si molesta, se
  regenera el keyframe con prompt "no signage/no logos".
- Veo a veces aplica filtros (audio/RAI); por eso un clip se generó en el modelo estándar.
- El audio nativo de Veo se descartó: el video usa **solo** la VO de ElevenLabs.
- VO generada con la voz configurada del perfil; si se quiere otra voz/tono, es 1 paso.

## No se hizo (por diseño / política)
- No se publicó, agendó, ni se tocó Meta Ads. No se gastó presupuesto. No se contactó leads.

## Próximo paso
Revisión de Jose. Si aprueba: variantes 1:1 / 4:5, y entrega a Production Designer /
Video Producer. Nada sale al aire sin tu autorización explícita.
