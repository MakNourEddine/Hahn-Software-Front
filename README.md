
# Dentist Booking — Frontend (React + TypeScript + Vite + Tailwind)

Frontend for the Dentist Booking application. It talks to the ASP.NET Core API and showcases a simple, realistic UI with dropdown-driven booking, future-only availability, appointments listing (with patient & service names), and CRUD admin pages.

---

## Quick start

### Prerequisites
- **Node.js** ≥ 18 (tested with 22)
- **npm** ≥ 9 (or yarn/pnpm if you prefer)

### 1) Install
```bash
npm install
```

### 2) Configure API base URL
Create `.env.local` at the project root:
```
VITE_API_URL=http://localhost:8080/api
```
> This must match your backend’s public URL (e.g., Docker compose exposes port `8080`).

### 3) Run
```bash
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

### 4) Production build
```bash
npm run build
npm run preview   # optional: serve the build locally
```

---

## What’s included

- **React 18** + **TypeScript**
- **Vite** for fast dev/build
- **Tailwind CSS** (utility-first UI)
- **React Router** for pages
- **React Query** (TanStack Query) for data fetching/caching
- Small API wrapper around `fetch` with JSON helpers & error handling

---

## Features

### Booking
- Select **Dentist**, **Patient**, **Service** from **dropdowns** (no manual GUIDs)
- Pick a **date** from calendar; **availability** shows **only future time slots** (for today, past times are hidden)
- Quick-book by picking **date + time** (15-min steps)
- Cancel or reschedule existing appointments

### Appointments
- List per **dentist/day**
- Shows **patient name** and **service name** beside time/status

### Admin CRUD
- Manage **Dentists**, **Patients**, **Services**
- Create, edit, delete rows inline

---

## Folders (summary)

```
src/
  api/               # small HTTP layer and entity/appointment APIs
  components/        # shared UI (Button, Card, Select, tables, etc.)
  hooks/             # React Query hooks (useAppointments, useEntities)
  lib/               # helpers: datetime, types
  pages/
    BookingPage.tsx
    admin/
      DentistsPage.tsx
      PatientsPage.tsx
      ServicesPage.tsx
  App.tsx            # router + shell
  main.tsx           # Vite bootstrap
```

---

## Configuration

### Environment variables
- `VITE_API_URL` — base URL for the backend (e.g., `http://localhost:8080/api`).  
  Vite exposes `import.meta.env.VITE_API_URL`.

> Dev tip: when you change `.env.local`, stop and restart `npm run dev` so Vite reloads envs.

### CORS
The browser calls the API from a different origin (5173 → 8080). Make sure your API enables CORS (dev policy can be “AllowAll”). Example in ASP.NET:
```csharp
builder.Services.AddCors(o => o.AddPolicy("AllowAll",
  p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
app.UseCors("AllowAll");
```
> For authenticated scenarios use `AllowCredentials` and a specific origin list instead of `AllowAnyOrigin`.

### Time zones
- The backend returns **UTC** (DateTimeOffset).  
- The frontend displays **local time** with `toLocaleString()` for human readability.  
To always display UTC, format with `toUTCString()` or an explicit formatter (e.g., date-fns / Intl API).

---

## Scripts

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 4173",
    "lint": "eslint ."
  }
}
```

> If ESLint flags `no-explicit-any`, use `unknown` and narrow with `instanceof Error` when catching errors.

---

## API layer

- `src/api/http.ts` – minimal JSON client:
  - reads `VITE_API_URL`
  - attaches `Content-Type: application/json`
  - throws a friendly `Error` when the response is not OK
- `src/api/appointments.ts` – availability, listByDentist, book, cancel, reschedule
- `src/api/entities.ts` – CRUD for dentists, patients, services

**Example**
```ts
import { http } from './http';

export const EntitiesApi = {
  dentists: () => http('/dentists'), // resolves to `${VITE_API_URL}/dentists`
};
```

---

## Booking page logic (high level)

1. Load **dentists**, **patients**, **services** for the dropdowns (`useDentists`, `usePatients`, `useServices`).
2. When a dentist + date are selected, load **availability** (`useAvailability`) and **appointments** (`useAppointments`).
3. Filter availability to **future**: `new Date(slot.startUtc) > new Date()`.
4. Book from a slot or from manual date+time; refresh data.
5. Cancel/reschedule mutate appointments then refresh.

---

## Styling

Tailwind is configured with:
- dark background
- soft borders and rounded cards
- minimal tokens (you can extend in `tailwind.config.js`)

**Common utilities used**  
`grid place-items-center`, `flex items-center justify-between`, `max-w-6xl mx-auto`, `rounded-xl`, `border`, `text-slate-*`

---

## Deploy

### Static hosting (Netlify/Vercel/GitHub Pages)
1. Build:
   ```bash
   npm run build
   ```
2. Upload the `dist/` folder to your host.
3. Set environment variable `VITE_API_URL` (or bake it into `.env.production` before build).

### Docker (optional)
```Dockerfile
# Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Optional: supply a default.conf with SPA fallback
```
> If your API base URL differs between environments, consider templating it or serving a small `/config.json` your app fetches on boot.
