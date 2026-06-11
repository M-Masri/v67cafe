# Cafe 67 Frontend

React/Vite storefront for browsing drinks, tracking the daily remaining cup count, guest checkout, customer login/register, order history, and reordering.

## Environment

Create `.env` in the project root (see `.env.example`):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Production example:

```env
VITE_API_URL=https://v67.sawatech.ae/api
```

All API calls read `VITE_API_URL` through `src/config/api.js`. Restart `npm run dev` after changing `.env`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
