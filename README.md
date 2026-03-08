# portfolio

Portfolio of mine I fear.

**[wreck-x](https://vinyl-portfolio-azure.vercel.app/)** &nbsp;·&nbsp; [GitHub](https://github.com/Wreck-X)

---

## stack

- [SvelteKit](https://kit.svelte.dev) — framework
- [Tailwind CSS](https://tailwindcss.com) — styling (with typography + forms plugins)
- TypeScript, Prettier, ESLint

---

## getting started

```sh
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173) in your browser.

---

## build & preview

```sh
npm run build
npm run preview
```

---

## deploy

This project is deployed on [Vercel](https://vercel.com). Push to `main` to trigger a deployment.

To recreate the project from scratch:

```sh
npx sv create --template minimal --types ts \
  --add prettier eslint tailwindcss="plugins:typography,forms" \
  sveltekit-adapter="adapter:auto" \
  --install npm portfolio
```

---

## project structure

```
src/
├── routes/
│   └── +page.svelte   # vinyl carousel + project detail view
└── app.html
```