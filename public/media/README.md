# XETHKIOZ media assets

Production hero loop expected files:

- `xethkioz-world-loop-720p.mp4` for desktop/tablet.
- `xethkioz-world-loop-mobile.mp4` for low bandwidth/mobile fallback.

Rules:

- No audio track.
- Use `muted`, `playsInline`, `loop` and `preload="metadata"` in React.
- Keep desktop loop under 3 MB when possible.
- Keep mobile loop under 1 MB when possible.
- Use a CSS pixel fallback so the homepage still works if the video is missing.
