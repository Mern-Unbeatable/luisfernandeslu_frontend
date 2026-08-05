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
├── data/                 # Static / demo data (temporary until backend APIs)
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

### `data/` — static & demo data (temporary)

Holds seed / mock payloads used while the UI is built **without a backend**.

| File | Purpose |
|------|---------|
| `demoData.js` | **Single source** for all `DEMO_*` mocks (auth users, products, orders, auctions, messenger, form placeholders, …) |
| `productCategories.js` | Public category mega-menu tree (static catalog labels) |

```js
import { DEMO_PRODUCT, DEMO_USERS } from '@/data/demoData'
```

**Backend migration (do this feature by feature):**

1. Add / finish RTK Query endpoints in `features/<module>/<module>Api.js`.
2. In pages and components, replace `DEMO_*` imports with the matching API hooks (`useGetProductQuery`, `useGetOrdersQuery`, …).
3. Delete the unused section from `demoData.js` once nothing imports it.
4. Keep `demoData.js` only for developer previews (`src/developer/`) if still useful — never ship production screens that depend on it.

Role helpers such as `getHomePathForRole` stay in `features/auth/demoUsers.js` (not data). Demo **accounts** themselves live in `demoData.js`.

**Put here:** mock payloads and static catalog trees — never JSX, never API calls.

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
   ├─ features/<module>/<module>Api.js   (endpoints)  ← prefer this
   ├─ features/<module>/<module>Slice.js (UI state)
   ├─ data/demoData.js                   (temporary mocks only)
   └─ services/api/baseApi.js
        └─ axiosInstance.js
             └─ interceptors.js
```

Using RTK Query automatically wires caching, loading and error states into the Redux store.

Until the API exists, screens may import from `data/demoData.js`. After backend integration, each feature should read from its `*Api.js` hooks instead — see the `data/` section above.

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
| Demo / mock payloads (pre-backend) | `data/demoData.js` — swap for `features/<module>/*Api.js` when backend is ready |
| Category mega-menu tree | `data/productCategories.js` |
| Reusable data table (tabs/filters/pagination) | `components/data-display/DataTable` |
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