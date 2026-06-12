# Deploying to Cloudflare Pages

## One-time setup

1. **Install & log in to Wrangler**
   ```bash
   npx wrangler login
   ```

2. **Create the remote D1 database**
   ```bash
   npx wrangler d1 create portfolio-blog
   ```
   Copy the `database_id` it prints into `wrangler.jsonc` (replace `REPLACE_WITH_ID_FROM_WRANGLER_D1_CREATE`).

3. **Run the migration on the remote DB**
   ```bash
   npx wrangler d1 execute portfolio-blog --remote --file=migrations/0001_init.sql
   ```

4. **Create the Pages project** (first deploy)
   ```bash
   npm run build
   npx wrangler pages deploy .svelte-kit/cloudflare --project-name=portfolio
   ```

5. **Set the admin password secret** (don't use the `vars` default in `wrangler.jsonc` for prod)
   ```bash
   npx wrangler pages secret put BLOG_ADMIN_PASSWORD --project-name=portfolio
   ```
   Also bind the D1 database to the Pages project in the Cloudflare dashboard
   (Pages → portfolio → Settings → Functions → D1 bindings: `DB` → `portfolio-blog`).

## Everyday deploys

```bash
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=portfolio
```

Or connect the GitHub repo in the Cloudflare dashboard for push-to-deploy.

## Local dev

```bash
npm run dev
```

`platformProxy` in `svelte.config.js` auto-loads the local D1 (stored under `.wrangler/`) and the `BLOG_ADMIN_PASSWORD` from `wrangler.jsonc`. To reset local data:

```bash
rm -rf .wrangler/state
npx wrangler d1 execute portfolio-blog --local --file=migrations/0001_init.sql
```
