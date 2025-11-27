Tech Blue • M3U Builder + Karaoke Pro
======================================

Estructura:
- index.html
- style.css
- script.js

Cómo usar (local o GitHub Pages):
1) Abre `index.html` en tu navegador. No requiere servidor.
2) Pestañas arriba: **M3U Builder** y **Karaoke**.

M3U Builder:
- Carga `.m3u`, `.m3u8` o `.json` (de listas personalizadas).
- Filtra por categoría o por texto, verifica canales con HLS.js.
- Crea listas personalizadas, agrega el canal actual y exporta `.m3u` o `listas_personalizadas.json`.
- Persistencia automática en `localStorage`.

Karaoke:
- Busca canciones en YouTube (usa la API pública del ejemplo).
- Crea participantes, añade canciones, exporta por participante (JSON/M3U) o la sesión completa.
- Genera una **cola de turnos round‑robin** y usa Siguiente/Anterior.
- Reproductor YouTube con botón **Play** (gesto requerido por el navegador).

Neon Stage (solo durante música):
- El escenario **Tech Blue** permanece sobrio por defecto.
- Cuando el player está **PLAYING**, se activa el fondo **Neon** y el **visualizador**.
- Selector de color (5 opciones) arriba a la derecha del módulo Karaoke.

Nota sobre el visualizador:
- Por políticas del navegador no se puede acceder al audio crudo del iframe de YouTube.
- El visualizador implementa una animación sincronizada al tiempo de reproducción para lograr un
  efecto reactivo elegante sin romper políticas de seguridad.
- Si reproduces audio de la misma página (mismo origen), puedes conectar un `AudioContext` real.

API Keys:
- El buscador de YouTube usa una key de ejemplo en `script.js`. Reemplázala por la tuya si lo deseas.

© Cuervo‑Inc • Tech Blue
