# PFANDIGO Website

Statische Marketing-Website für **PFANDIGO** — die App zum einfachen Pfand-Zurückgeben und -Abholen.

Live: [pfandigo.com](https://pfandigo.com)

## Seitenstruktur

| Ordner | URL | Beschreibung |
|---|---|---|
| `/` | pfandigo.com | Startseite |
| `/pfandgeber` | pfandigo.com/pfandgeber | Landingpage für Pfandgeber |
| `/abholer` | pfandigo.com/abholer | Landingpage für Abholer |
| `/faq` | pfandigo.com/faq | Häufige Fragen |
| `/kontakt` | pfandigo.com/kontakt | Kontaktseite |
| `/impressum` | pfandigo.com/impressum | Impressum |
| `/datenschutz` | pfandigo.com/datenschutz | Datenschutzerklärung |

## Assets

- `assets/img/` — Bilder, OG-Images, Mockups
- `assets/css/` — Stylesheets
- `assets/js/` — JavaScript
- `favicon.ico`, `logo.png`, `site.webmanifest` — Icons & PWA-Manifest

## Deployment

Das Repo ist mit **GitHub Pages** verbunden (Custom Domain via `CNAME`). Jeder Push auf `main` wird automatisch live auf pfandigo.com.

## Lokal testen

Kein Build-Schritt nötig — einfach `index.html` im Browser öffnen oder einen lokalen Server starten:

```bash
npx serve .
```

## OG-Bild (Social Media Vorschau)

Das Vorschaubild beim Teilen von Links (z.B. Instagram, WhatsApp) wird über die `og:image` Meta-Tags gesetzt. Aktuelles Bild: `assets/img/PFANDIGO_01.png`

Um das Bild zu ändern, in allen `index.html`-Dateien den Dateinamen anpassen und die Versionsnummer (`?v=X`) erhöhen, damit Browser-Caches aktualisiert werden.
