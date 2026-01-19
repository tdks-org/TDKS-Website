# TDKS Static Website (HTML)

This repository contains a simple, static HTML website for an NGO (TDKS). No build tools are required.

Included files:
- index.html — Home page
- about.html — About page
- events.html — Events listing
- contact.html — Contact & donation info
- styles.css — Shared styling

How to view locally:
1. Download or clone the repository.
2. Open `index.html` in your browser (double-click or `open index.html` / `xdg-open index.html`).

Create a zip locally:
- zip -r tdks-website.zip .

Deploy options:
- GitHub Pages:
  - Push files to a repository and enable GitHub Pages from the repository settings (use branch `main` and root folder).
- Any static host:
  - Netlify, Vercel (static sites), Surge, GitLab Pages, S3 + CloudFront.
- Just upload the files to your web host and ensure `index.html` is served as the default document.

Forms:
- The contact form uses a simple `mailto:` action by default (opens an email client).
- For serverless forms, use services like Formspree, Netlify Forms, or set up a small server endpoint. I can help integrate that.
