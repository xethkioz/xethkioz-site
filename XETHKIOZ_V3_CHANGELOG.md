# XETHKIOZ v3.0 Changelog

## Applied fixes

- Fixed `Logo.tsx` so the full XETHKIOZ logo renders without clipping.
- Expanded the SVG viewBox from `200` to `300` units and corrected responsive sizing.
- Preserved the XETHKIOZ visual identity: orange X, purple ETHKIOZ text, gradients, and glow filters.
- Fixed invalid Tailwind header height class by replacing `md:h-18` with `md:h-20`.
- Fixed main layout padding to match the new header height.
- Reduced excessive blank space in the homepage hero section.
- Replaced the unsafe third-party About page portrait with the provided XETHKIOZ founder image.
- Added the provided About image to `public/images/xethkioz-about.webp`.

## Build verification

- `npm ci`: completed.
- `npm run build`: completed successfully.

## Notes

- The `.env` file is intentionally excluded from the exported ZIP for security.
- Keep `.env.example` and configure real Supabase variables in the hosting platform.
