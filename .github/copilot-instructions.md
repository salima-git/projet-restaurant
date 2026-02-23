<!-- Copilot / AI agent instructions for this small static site project -->
# Project overview

This is a small, static, client-side website (HTML/CSS/vanilla JS). There is no build system, package manager, or server-side code in the repository — files are served directly as static assets from the project root.

Key entry points:
- `index.html` — Home page and login modal wiring (`script.js`).
- `produits.html` — Products page that should show API-driven product cards and contains `#resultats-api` where results are rendered.
- `script.js` — Handles the login modal (`btnconnexion`, `formContainer`, `loginForm`).
- `produit.js` — Handles remote API calls and rendering for product lists (uses ThemealDB API).
- `style.css` — Visual styles and layout.

Run / debug
- No build step. Open `index.html` or `produits.html` in a browser via a static server (recommended) or the Live Server extension.
- Quick local server (PowerShell) from project folder:

```powershell
python -m http.server 8000
# then open http://localhost:8000/index.html
```

- Open DevTools → Console and Network to inspect runtime errors and API calls. The project uses client-side `fetch`, so run from an HTTP server to avoid file:// CORS or fetch restrictions.

Patterns and important conventions (codebase-specific)
- DOM-first vanilla JS: scripts query elements by exact IDs/classes. Example: `document.getElementById('btnconnexion')` in `script.js`.
- API fetch logic lives in `produit.js`. It expects clickable elements with class `.voir-plus` and a `data-type` attribute (`premium` or `standard`) to choose which ThemealDB category to fetch. It updates `#resultats-api` with results and uses `response.ok` checks and try/catch for error display.
- Styling is global (no CSS modules). Assets like `back.mp4`, `chicken.jpg`, `burger.jpg` are referenced by relative paths from HTML files.

Project-specific quirks and actionable notes for AI edits
- Selector mismatch (important): `produit.js` attaches listeners to `.voir-plus`, but `produits.html` currently uses `<a class="btn-produit" ...>voir plus</a>`. If you implement behavior, either update HTML to use `class="voir-plus" data-type="premium|standard" href="#"` or change the selector in `produit.js` to `.btn-produit` and read an appropriate attribute. Example fix (HTML):

```html
<a href="#" class="voir-plus" data-type="premium">voir plus</a>
```

or change in `produit.js`:

```js
document.querySelectorAll('.btn-produit').forEach(...)
```

- Modal visibility: `index.html` puts `class="hidden"` on `#formContainer` but `style.css` has `.hidden{display:none}` commented out. Either re-enable the `.hidden` rule or rely on `#formContainer { display: none; }` already present.
- Navigation links: many anchors point to `premium.html` or `standart.html` but those files are not present. Treat these as placeholders. Clicking such anchors will navigate away unless `event.preventDefault()` is used and the script intercepts them.

API and external integration
- `produit.js` uses ThemealDB endpoints like `https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef` and `...c=Chicken`. Tests should verify the API response shape (`data.meals` and `strMealThumb` / `strMeal`). Use the Network panel to confirm JSON shapes and CORS headers.

Testing and verification guidance
- Manual acceptance: open `produits.html` on a local server, trigger the product action (see selector note), and confirm that `#resultats-api` displays cards with `<img>` and `<h4>` populated from the API.
- Debugging hints: add `console.log` at the start of click handlers to ensure listener registration, check `document.querySelectorAll(...)` length to detect selector mismatches.

Change guidance for PRs
- Keep changes small and focused (fix selector, fix HTML attributes, or add missing placeholder pages). Use descriptive commit messages like "fix: align product button selector with produit.js".
- When adding new JS behavior, prefer progressive enhancement: do not require a bundler — keep code as simple, ES6-compatible browser JS.

Files to inspect when making changes
- `produit.js`, `produits.html`, `index.html`, `script.js`, `style.css`.

If anything here looks incomplete or you want me to update selectors or add the missing placeholder pages (`premium.html`, `standart.html`), tell me which change you prefer and I'll apply it.
