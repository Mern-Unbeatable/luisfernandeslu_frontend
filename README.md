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
├── features/            # Feature modules — only pages + components
├── users/                # User-related pages + components
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

- **`store/`** — the Redux store. `index.js` creates the store, `rootReducer.js` combines the slices, `middleware.js` adds RTK Query middleware, and `slices/` holds the Redux slices (`authSlice`, `userSlice`, etc.).
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

### `features/` — feature modules (UI only)

Each feature folder contains only **`pages/`** and **`components/`** used by that area. No API or Redux state lives here — those are kept out of the feature folders to stay simple:

```text
features/auth/
├── pages/               # screens for this feature
└── components/          # components used only by this feature
```

Current features: `auth`, `products`, `orders`.

**Put here:** feature-specific pages and components. Components used by only one feature stay inside that feature; components reused across features go in `components/`.

### `users/` — user pages + components

Kept separate from `features/` as its own top-level area. Contains only UI:

```text
users/
├── pages/               # user account screens
└── components/          # user-specific components
```

- **User API endpoints** live in `services/api/userApi.js`.
- **User Redux slice** lives in `app/store/slices/userSlice.js`.

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

- **`api/`** — HTTP layer **plus** every RTK Query endpoint, all in one place:
  - `baseApi.js` — the RTK Query base API object (`injectEndpoints`).
  - `axiosInstance.js` — the configured Axios instance.
  - `interceptors.js` — request/response interceptors (auth header + token refresh).
  - `authApi.js`, `userApi.js`, `productApi.js`, `orderApi.js` — the endpoint (RTK Query) definitions for each module.
- **`storage/`** — `localStorage.js` abstracts browser storage (token storage helpers etc.).

All API code lives here centrally, so feature folders never need their own `api/` subfolder.

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
   └─ services/api/<module>Api.js   (RTK Query endpoints)
        └─ services/api/baseApi.js    (base query)
             └─ services/api/axiosInstance.js  (Axios)
                  └─ services/api/interceptors.js (token refresh)
```

Using RTK Query automatically wires caching, loading and error states into the Redux store.

---

## Route guard / authentication flow

```
guest page          → app/router/PublicRoute
logged-in page      → app/router/ProtectedRoute (optionally restricted by role via roles/*/permissions)
auth state          → app/store/slices/authSlice.js
tokens              → services/storage/localStorage.js (via tokenStorage)
HTTP auth header    → services/api/interceptors.js
```

---

## Adding new code — quick map

| Task | Go to |
|------|-------|
| New global UI component | `components/ui/` or `components/common/` or `components/data-display/` |
| New page shell | `layouts/` |
| New feature/screen | `features/<module>/` (pages + components) |
| User screens/components | `users/` |
| New role area | `roles/<role>/` (`menu.js`, `permissions.js`) |
| New backend module endpoints | `services/api/<module>Api.js` |
| Shared hook | `hooks/` |
| API / HTTP config | `services/api/` |
| Redux slice | `app/store/slices/<name>Slice.js` |
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