# Sarmila J — Full-Stack Portfolio

This version adds a real Node.js/Express backend to the portfolio.

## What the backend does

- Serves the portfolio frontend.
- Provides `GET /api/health` for a backend health check.
- Provides `GET /api/projects` as a sample portfolio API.
- Provides `POST /api/contact` for the contact form.
- Stores contact messages in a local SQLite database.
- Can optionally send email notifications through SMTP.

## Run locally

1. Install Node.js (LTS).
2. Open a terminal inside this folder.
3. Run:

```bash
npm install
npm start
```

4. Open:

http://localhost:3000

## Optional email notifications

Copy `.env.example` to `.env` and add SMTP credentials.

Do not put passwords directly in `server.js`, HTML, or GitHub.

## Deploying

This structure can be deployed to a Node-compatible host such as Render, Railway, or another service that supports Node.js.

For production, replace local SQLite with a hosted database if you need reliable persistence across multiple server instances.
