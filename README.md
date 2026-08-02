# CONSTRUPRECO — Frontend

A React + Vite application built with Redux Toolkit (RTK Query), Axios, React Router v7 and Tailwind CSS v4.

This document describes the **project folder structure** in detail — what each folder is for, how the pieces fit together, and where to add new code.

---

## Quick start

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run eslint
```

Environment variables live in `.env` (see `.env.example`) and are read in `src/config/env.js`.

---

## Folder structure overview

```text
src/
├── app/                  # App-wide wiring: Redux store, router, providers
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Global reusable UI components
├── layouts/              # Page layout shells
├── features/            # Business modules (self-contained per area)
├── roles/                # Role-based configuration (menu, permissions)
├── hooks/                # Shared React hooks
├── services/             # API client, HTTP layer, storage abstraction
├── utils/                # Pure helper functions
├── config/               # Env & app configuration
├── styles/               # Global CSS + design tokens
├── App.jsx               # Root app component
└── main.jsx              # Entry point
```

---

## Top-level folders — what they do

### `app/` — App wiring (Redux store, router, providers)

Holds everything that **boots the application**.

- **`store/`** — the Redux store. Split into `index.js` (creates the store), `rootReducer.js` (combines all slices), and `middleware.js` (RTK Query middleware).
- **`router/`** — route definitions. `index.jsx` builds the router; `PublicRoute.jsx` and `ProtectedRoute.jsx` guard pages for guests vs. logged-in users (optionally by role).
- **`providers/`** — `AppProvider.jsx` wraps the app with the Redux `<Provider>`.

**Put here:** anything that is app-wide configuration and only set up once.

### `assets/` — static files

- `images/` — static images.
- `icons/` — SVG / icon assets.
- `fonts/` — font files.

**Put here:** raw, public-facing assets that Vite copies as-is.

### `components/` — global reusable components

Unopinionated building blocks with **no business logic**, reused across many screens.

- **`ui/`** — low-level primitives: `Button`, `Input`, `Select`, `Modal`, etc.
- **`common/`** — generic helpers: `Loader`, `ErrorBoundary`, `EmptyState`, `Pagination`.
- **`data-display/`** — data presentation: `Table`, `Card`.

**Put here:** anything used by more than one feature. Rule of thumb — if you copy-paste a component across pages, promote it here.

### `layouts/` — page shells

Layouts define the surrounding frame of a screen and render the page content via an `<Outlet/>`.

- **`PublicLayout/`** — the marketing / guest shell: `/PublicLayout.jsx`, `/Header.jsx`, `/Footer.jsx`.
- **`DashboardLayout/`** — the logged-in app shell: `/DashboardLayout.jsx`, `/Sidebar.jsx`, `/Navbar.jsx`, `/Breadcrumb.jsx`.

### `features/` — business modules

Each folder is one **domain of the app** and is self-contained, mirroring one backend module:

```text
features/auth/
├── api/
│   └── authApi.js      # RTK Query endpoints for auth
├── components/         # components used only by this feature
├── hooks/              # hooks used only by this feature
├── pages/              # screens for this feature
├── authSlice.js        # Redux state (global side-effect state)
└── validation.js       # form/validation schemas
```

Current features: `auth`, `users`, `products`, `orders`.

**Put here:** feature-specific components, hooks, pages, API calls and slices. Components that are only used by one feature **stay inside that feature**; components reused across features go in `components/`.

### `roles/` — role-based configuration

One folder per role (`admin`, `manager`, `user`), each with:

- `menu.js` — navigation menu definition for that role.
- `permissions.js` — access rules.

**Put here:** per-role navigation and permission config used by guards and menus.

### `hooks/` — shared React hooks

Reusable hooks that are **not bound to one feature**:

- `useAuth.js` — authentication logic.
- `usePermission.js` — permission checks.
- `useDebounce.js` — debounce utility.

Feature-specific hooks live inside their feature folder instead.

### `services/` — external / infrastructure layer (no UI)

- **`api/`** — HTTP layer using Axios + RTK Query:
  - `baseApi.js` — the RTK Query base API object (`injectEndpoints`).
  - `axiosInstance.js` — the configured Axios instance.
  - `interceptors.js` — request/response interceptors (auth header + token refresh).
- **`storage/`** — `localStorage.js` abstracts browser storage (token storage helpers etc.).

**Put here:** anything that talks to the outside world or the browser — it must never contain JSX.

### `utils/` — pure helper functions

- `constants.js` — shared constants.
- `helpers.js` — general helpers.
- `formatter.js` — formatting utilities (dates, currency, etc.).
- `permissions.js` — permission helper logic.

**Put here:** side-effect-free functions used across the app.

### `config/` — configuration

- `env.js` — environment variables (`import.meta.env.VITE_*`).
- `appConfig.js` — static app config (name, constants at launch).

### `styles/`

- `globals.css` — global CSS, imports Tailwind and the theme.
- `variables.css` — design tokens / theme colors / CSS variables.

---

## How data flows

```text
Page component
   └─ features/<feature>/api/<feature>Api.js   (RTK Query endpoint)
        └─ services/api/baseApi.js             (base query)
             └─ services/api/axiosInstance.js  (Axios)
                  └─ services/api/interceptors.js (token refresh)
```

Using RTK Query automatically wires caching, loading and error states into the Redux store.

---

## Route guard / authentication flow

```
guest page          → routes/ PublicRoute
logged-in page      → routes/ ProtectedRoute (optionally restricted by role via roles/*/permissions)
auth state          → features/auth/authSlice.js
tokens              → services/storage/localStorage.js (via tokenStorage)
HTTP auth header    → services/api/interceptors.js
```

---

## Adding new code — quick map

| Task | Go to |
|------|-------|
| New global UI component | `components/ui/` or `components/common/` or `components/data-display/` |
| New page shell | `layouts/` |
| New feature/screen | `features/<module>/` (components, hooks, pages, api) |
| New role area | `roles/<role>/` (`menu.js`, `permissions.js`) |
| New backend module | `features/<module>/api/<module>Api.js` |
| Shared hook | `hooks/` |
| API / HTTP config | `services/api/` |
| Storage / tokens | `services/storage/` |
| Pure helpers | `utils/` |
| Env / app config | `config/` |
| Global styles / tokens | `styles/` |

---

## Naming conventions

| Item | Rule | Example |
| --- | --- | --- |
| Folder (component/ui) | PascalCase | `Button/` |
| Component file | PascalCase + `.jsx` | `Button.jsx` |
| API file | camelCase + `Api.js` | `authApi.js` |
| Slice file | camelCase + `Slice.js` | `authSlice.js` |
| Hook file | camelCase + `useXxx.js` | `useAuth.js` |
| Utils/file | camelCase | `formatter.js` |
| CSS | kebab-case | `variables.css` |

---

This structure keeps UI, infrastructure, and business logic separated, so each area can grow independently without creating circular dependencies or scattered code.