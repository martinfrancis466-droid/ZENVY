# ZENVY MVP

A starter social-media web app built with React + Vite. It is designed to be beginner-friendly and can be run locally for free.

## Features in this first version

- Home feed with text posts
- Image and video posts from files on your device
- Like and comment interactions
- Search/discover people and posts
- Simple profile page
- Demo messages screen
- Local browser storage for posts and likes

## Important limitations

This is a **front-end MVP**. Posts and profile data are saved in the current browser on the current device. They are not shared with other users yet. Messages are a demo interface, not live messaging. Real accounts, cloud media uploads, cross-device sync, moderation, and live messaging require a backend service and additional setup.

## Run on your computer

Install Node.js LTS first from https://nodejs.org/ . Then open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Vite will show a local URL, usually `http://localhost:5173`. Open it in your browser.

To test a production build:

```bash
npm run build
npm run preview
```

## Upload to GitHub

1. Create/open your repository.
2. Upload the project files and folders from this ZIP.
3. Do not upload `node_modules` or `dist`.
4. Do not upload secrets in `.env`. The included `.env.example` is safe as a template.

## Free hosting option

After the first version works, you can deploy the front-end to a free static-hosting tier such as GitHub Pages, Netlify, or Vercel. Check the provider's current limits before deploying. A static deployment will not add cloud accounts or shared data by itself.
