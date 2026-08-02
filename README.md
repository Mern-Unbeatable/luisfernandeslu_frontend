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
├── pages/                # Route screens (side by side with features — not nested)
├── features/             # Domain only: *Api.js + *Slice.js (no UI)
├── roles/                # Role-based configuration (menu, permissions)
├── hooks/                # Shared React hooks
├── services/             # API client, HTTP layer, storage abstraction
├── utils/                # Pure helper functions
├── config/               # Env & app configuration
├── styles/               # Global CSS + design tokens
└── main.jsx              # Entry point
```

---

## Top-level folders — what they do

### `app/` — App wiring (Redux store, router, providers)

Holds everything that **boots the application**.

- **`store/`** — store wiring only: `index.js` creates the store, `rootReducer.js` combines feature slices + `baseApi`, `middleware.js` adds RTK Query middleware. Feature slices and endpoints live under `features/`, not here.
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

### `pages/` — route screens (top-level, not nested under features)

Every screen that a URL points to lives here. `pages/` sits **next to** `features/`, not inside it — easier for beginners to find “where are the screens?”

```text
pages/
├── HomePage.jsx
├── auth/                # Login, Register, ForgotPassword, …
├── products/            # ProductList, ProductDetails, …
├── orders/              # OrderList, OrderDetails, …
└── users/               # Profile, Settings, …
```

**Put here:** page components only. Pages import shared UI from `components/` and data hooks from `features/`.

### `features/` — API endpoints + Redux slices only (no UI)

Each feature folder is **logic only** — no JSX, no `components/` folder:

```text
features/products/
├── productApi.js        # RTK Query endpoints
└── productSlice.js      # client/UI state (filters, selected id, …)
```

Current features: `auth`, `products`, `orders`, `users`.

**Put here:** endpoints + slices. All UI lives in `pages/` (screens) or `components/` (reusable).

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

### `services/` — HTTP plumbing only (no feature endpoints)

- **`api/`** — shared transport layer only:
  - `baseApi.js` — RTK Query base API (`injectEndpoints` target)
  - `axiosInstance.js` — configured Axios instance
  - `interceptors.js` — auth header + token refresh
- **`storage/`** — `localStorage.js` (token helpers, etc.)

Feature endpoints (`authApi`, `productApi`, …) live under `features/<module>/`, not here.

**Put here:** infrastructure that talks to the network/browser — never JSX, never domain endpoints.

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
pages/<module>/Page.jsx
   ├─ components/ui|common|data-display/…
   ├─ features/<module>/<module>Api.js   (endpoints)
   ├─ features/<module>/<module>Slice.js (UI state)
   └─ services/api/baseApi.js
        └─ axiosInstance.js
             └─ interceptors.js
```

Using RTK Query automatically wires caching, loading and error states into the Redux store.

---

## Route guard / authentication flow

```
guest page          → app/router/PublicRoute
logged-in page      → app/router/ProtectedRoute (optionally restricted by role via roles/*/permissions)
auth state          → features/auth/authSlice.js
auth endpoints      → features/auth/authApi.js
tokens              → services/storage/localStorage.js (via tokenStorage)
HTTP auth header    → services/api/interceptors.js
```

---

## Adding new code — quick map

| Task | Go to |
|------|-------|
| New screen / route page | `pages/<module>/` |
| Translation strings | `i18n/locales/en.json` (+ `pt.json`, `es.json`) |
| Page SEO title/description | `config/seo.js` + router `handle.seo` (or `<Seo title="..." />`) |
| New feature endpoints | `features/<module>/<module>Api.js` |
| New feature UI state | `features/<module>/<module>Slice.js` |
| New global / reusable UI | `components/ui/` or `components/common/` or `components/data-display/` |
| New page shell | `layouts/` |
| New role area | `roles/<role>/` (`menu.js`, `permissions.js`) |
| Shared hook | `hooks/` |
| HTTP plumbing (baseApi/axios) | `services/api/` |
| Register slice in store | `app/store/rootReducer.js` (+ import `*Api` in `store/index.js`) |
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