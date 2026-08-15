# Ely Ver Romantico — Web Resume

A single-page web resume for **Ely Ver Romantico**, Accountant (Bulacan, Philippines).

Built as a static site with no dependencies, no build step, and no external requests —
three files that can be opened directly in a browser or dropped on any static host.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All resume content and page structure |
| `styles.css` | Screen styling, light/dark themes, and the print stylesheet |
| `script.js` | Theme toggle, scroll spy, progress bar, reveal animations |

## Viewing locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- **Responsive** — three-column grids on desktop collapse to a single column on mobile;
  the experience timeline reflows to a left-rule layout on small screens.
- **Light & dark themes** — follows the visitor's OS preference by default, with a manual
  toggle that persists in `localStorage`.
- **Print / PDF export** — the "Save PDF" button opens the browser print dialog. A dedicated
  print stylesheet reformats the page into a clean, ATS-friendly two-page document: navigation
  and decorative elements are dropped, colors flatten to black on white, competencies reflow
  into two columns, and skill tags collapse to comma-separated lists.
- **Accessible** — skip link, semantic landmarks, visible focus rings, `aria-pressed` on the
  theme toggle, and full support for `prefers-reduced-motion` (animations are disabled rather
  than merely shortened).
- **Self-contained** — system font stack and inline SVG icons, so it renders offline and there
  are no third-party requests.

## Updating the content

All resume text lives in `index.html` — edit it directly. The main sections are marked with
comment banners (`<!-- ====== EXPERIENCE ====== -->`, etc.).

To add a role, copy an existing `<li class="job">` block inside `<ol class="timeline">`. The
`badge-current` span marks the present role, and the first job in the list automatically gets
the highlighted gold timeline dot.

The four hero stat tiles are in `<aside class="hero-stats">`. Tiles with a `data-count`
attribute animate by counting up to that number on scroll; tiles without it render their text
as-is.

## Deploying

Any static host works. For GitHub Pages, push this branch and enable Pages for it in the
repository settings — `.nojekyll` is included so the files are served as-is.
