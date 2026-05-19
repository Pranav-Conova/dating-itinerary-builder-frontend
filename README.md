# Dating Itinerary Builder — Frontend

React + Vite + TailwindCSS UI for the Dating Itinerary Builder. Companion to [dating-itinerary-builder-backend](https://github.com/Pranav-Conova/dating-itinerary-builder-backend).

## Stack
- React 18
- Vite 5
- TypeScript
- TailwindCSS 3
- React Router 6

## Local dev

```bash
npm install
npm run dev
```

App at http://localhost:5173

By default the UI calls the API at `http://localhost:8000`. Override with:
```bash
echo "VITE_API_URL=https://your-api.example.com" > .env.local
```

## Build

```bash
npm run build
```

The production bundle lives in `dist/`.

## Docker

```bash
docker build -t dib-frontend .
docker run -p 5173:5173 dib-frontend
```

## Deploy on Render

The included `render.yaml` deploys this repo as a **Static Site**:
- Build command: `npm install && npm run build`
- Publish directory: `dist`

After the backend is deployed, set the `VITE_API_URL` env var on this service to point at the backend's Render URL, then redeploy.

## Pages
- `/` — Home: list of your dates, "New Date" form
- `/dates/:id` — Builder: pick activities from the catalog or add custom items, reorder, delete

## Demo user

For simplicity, v0 uses a single hardcoded demo user (`demo@example.com`). Replace this with real auth before going to production.
