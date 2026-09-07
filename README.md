# CONSTRUPRECO — Frontend

Marketplace / logistics platform UI for construction materials.

Stack: **React 19 · Vite 8 · Tailwind CSS v4 · Redux Toolkit (RTK Query) · React Router v7 · Axios · i18next**.

This README matches the **current** codebase. Prefer it over older notes that mention `DashboardLayout`, `pages/HomePage.jsx`, or per-component `demo*.js` files — those are gone.

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
npm run lint
```

Use **npm** + committed `package-lock.json` (not yarn). Coolify/Nixpacks chooses the installer from the lockfile — if a stale `yarn.lock` is present, deploy fails on `yarn install --frozen-lockfile`.

- Path alias: `@` → `src/` (see `vite.config.js`)
- Env: copy `.env.example` → `.env`, read via `src/config/env.js` (`import.meta.env.VITE_*`)

### Demo login

All demo accounts use password **`Password123!`** (admin: **`AdminDemo123!`**). Accounts live in `src/data/demoData.js` (`DEMO_USERS`) and match backend `pnpm seed:demo`. Helpers: `src/features/auth/demoUsers.js`.

| Role        | Email                  |
| ----------- | ---------------------- |
| customer    | `customer@demo.com`    |
| company     | `company@demo.com`     |
| supplier    | `supplier@demo.com`    |
| factory     | `factory@demo.com`     |
| transporter | `transporter@demo.com` |
| affiliate   | `affiliate@demo.com`   |
| admin       | `admin@demo.com`       |

---

## Mental model (for humans & agents)

```text
URL → app/router → layouts/* → pages/<role|public|auth>/*
                ↓
         components/*   (shared UI)
                ↓
         features/*Api  (prefer)  OR  data/demoData.js  (temporary mocks)
                ↓
         services/api   (axios + baseApi + interceptors)
```

**Rules of thumb**

| Need                             | Put it here                             |
| -------------------------------- | --------------------------------------- |
| Screen tied to a route           | `pages/...`                             |
| Reusable UI (2+ screens)         | `components/...`                        |
| Nav / sidebar for a role         | `roles/<role>/index.js`                 |
| API endpoints / client state     | `features/<module>/`                    |
| Mock payloads until backend      | `data/demoData.js`                      |
| Form field defaults (empty form) | component `defaults.js` (not demo data) |
| Live component docs              | `developer/` + `/developer`             |

---

## `src/` folder map

```text
src/
├── main.jsx                 # Entry: providers, router, i18n, globals.css
├── app/
│   ├── providers/           # Redux <Provider>
│   ├── router/              # Route tree, PublicRoute, ProtectedRoute
│   └── store/               # store, rootReducer, middleware
├── assets/                  # images, icons, fonts
├── components/              # Shared UI (see inventory below)
│   ├── auth/                # Auth form pieces
│   ├── common/              # Logo, Seo, Skeleton, messenger, …
│   ├── data-display/        # Cards, tables, timelines, details
│   ├── forms/               # AddProduct, CreateAuction
│   └── ui/                  # Button/Input/Modal/Select — stubs only (.gitkeep)
├── config/                  # env.js, appConfig.js, seo.js
├── data/
│   ├── demoData.js          # ★ Single source for all DEMO_* mocks
│   └── productCategories.js # Public category mega-menu tree
├── developer/
│   ├── catalog.js           # COMPONENT_DOCS (props, examples, imports)
│   └── ComponentPreview.jsx # Live previews for /developer
├── features/                # Logic only — no JSX pages
│   ├── auth/                # authApi, authSlice, demoUsers, roleAuthConfig
│   ├── orders/
│   ├── products/
│   └── users/
├── hooks/                   # Shared hooks (empty for now)
├── i18n/                    # i18next + locales en / pt / es
├── layouts/
│   ├── shared/              # Header, Footer, CategoryBar, mega-menu (used by PublicLayout + BuyerLayout)
│   ├── PublicLayout/        # Public page shell
│   ├── AuthLayout/          # Login / register shell
│   ├── BuyerLayout/         # customer + company
│   └── PanelLayout/         # supplier, factory, transporter, affiliate, admin
├── pages/
│   ├── public_page/         # Home, Developer, DisputeResolution, NotFound
│   ├── auth/
│   ├── shared/              # BuyerAccountDashboard, ComingSoonPage
│   ├── customer|company|    # Role dashboards & feature pages
│   ├── supplier|factory|
│   ├── transporter|affiliate|admin/
│   └── orders|products|users/   # placeholders (.gitkeep) — not used yet
├── roles/                   # Per-role nav config (index.js each)
├── services/
│   ├── api/                 # axiosInstance, baseApi, interceptors
│   └── storage/             # localStorage token helpers
├── styles/                  # globals.css, variables.css
└── utils/                   # empty for now
```

There is **no** `DashboardLayout` — use `PanelLayout` (B2B panels) or `BuyerLayout` (buyers).

---

## Roles & layouts

Wired in `src/roles/index.js` (**sidebar / layout config only** — not routes):

| Kind  | Roles                                                      | Layout        | Base path               |
| ----- | ---------------------------------------------------------- | ------------- | ----------------------- |
| Buyer | `customer`, `company`                                      | `BuyerLayout` | `/customer`, `/company` |
| Panel | `supplier`, `factory`, `transporter`, `affiliate`, `admin` | `PanelLayout` | `/supplier`, … `/admin` |

Each role folder exports nav items from `roles/<role>/index.js`.  
**All routes** are declared in `src/app/router/index.jsx` (lazy page imports + path). Adding a sidebar link without a matching router entry will 404 / hit the panel `*` Coming Soon catch-all.

Unmatched panel paths fall through to `ComingSoonPage`.

---

## Routes (summary)

**Source of truth:** `src/app/router/index.jsx`

| Path                                    | Shell        | Notes                                                      |
| --------------------------------------- | ------------ | ---------------------------------------------------------- |
| `/`                                     | PublicLayout | `HomePage` (currently returns `null` — header/footer only) |
| `/dispute-resolution`                   | PublicLayout | Public dispute UI                                          |
| `/developer`, `/developer/:componentId` | Standalone   | Component docs + live preview                              |
| `/login`, `/signup`, `/login/:role`, …  | AuthLayout   | Also `/admin/login`, password reset flow                   |
| `/customer/*`, `/company/*`             | BuyerLayout  | Protected — explicit children in router                    |
| `/supplier/*` … `/admin/*`              | PanelLayout  | Protected — explicit children in router                    |
| `*`                                     | PublicLayout | `NotFoundPage`                                             |

---

## Shared components inventory

### Documented on `/developer` (catalog + live preview)

These are the **common building blocks**. Docs: `src/developer/catalog.js`. Preview: `src/developer/ComponentPreview.jsx`. Demo props: `import { DEMO_* } from '@/data/demoData'`.

| Catalog id             | Component               | Path                                           |
| ---------------------- | ----------------------- | ---------------------------------------------- |
| `order-details`        | OrderDetails            | `components/data-display/OrderDetails/`        |
| `auction-card`         | AuctionCard             | `components/data-display/AuctionCard/`         |
| `auction-details`      | AuctionDetails          | `components/data-display/AuctionDetails/`      |
| `product-card`         | ProductCard             | `components/data-display/ProductCard/`         |
| `product-details`      | ProductDetails          | `components/data-display/ProductDetails/`      |
| `status-card`          | StatusCard              | `components/data-display/StatusCard/`          |
| `data-table`           | DataTable               | `components/data-display/DataTable/`           |
| `installment-timeline` | InstallmentTimeline     | `components/data-display/InstallmentTimeline/` |
| `delivery-timeline`    | DeliveryTimeline        | `components/data-display/DeliveryTimeline/`    |
| `dispute-resolution`   | DisputeResolution       | `components/data-display/DisputeResolution/`   |
| `create-auction`       | CreateAuction           | `components/forms/CreateAuction/`              |
| `add-product`          | AddProduct              | `components/forms/AddProduct/`                 |
| `panel-profile`        | PanelProfile            | `components/forms/PanelProfile/`               |
| `messenger`            | Messenger + useMessages | `components/common/messenger/`                 |

**When adding a shared component:** implement under `components/`, add `DEMO_*` to `data/demoData.js` if needed, register in `catalog.js`, wire a case in `ComponentPreview.jsx`, keep `id === previewId`.

### Implemented but not on `/developer`

| Area      | Components                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `common/` | Logo, Seo, Skeleton (+ Auth/Buyer/Home/Panel/Page/Table), LanguageSwitcher, ScrollToTop                                           |
| `auth/`   | AuthField, AuthSubmitButton, AuthModeToggle, AuthDemoAccounts, AuthFileUpload, AuthLegalNote, AuthSocialButtons, MarketingSidebar |

### Stubs only (folders exist, no code yet)

`components/ui/{Button,Input,Modal,Select}`, `components/common/{EmptyState,ErrorBoundary,Loader,Pagination}`.

---

## Demo data

**Single file:** `src/data/demoData.js`

```js
import { DEMO_PRODUCT, DEMO_ORDER_NEW, DEMO_USERS } from '@/data/demoData';
```

Also: `ADMIN_PRODUCT` (admin product-details preview).

Do **not** recreate old paths like `developer/demoData`, `ProductDetails/demoProduct.js`, etc.

| Kind                                     | Where                                                         |
| ---------------------------------------- | ------------------------------------------------------------- |
| Mock API-shaped payloads (`DEMO_*`)      | `data/demoData.js`                                            |
| Empty form defaults / select options     | `components/forms/*/defaults.js`                              |
| Auth path helpers (`getHomePathForRole`) | `features/auth/demoUsers.js` (re-exports users from demoData) |
| Category mega-menu labels                | `data/productCategories.js`                                   |

**Backend migration (feature by feature):**

1. Add RTK Query endpoints in `features/<module>/<module>Api.js`
2. Replace `DEMO_*` imports in pages with hooks
3. Delete unused sections from `demoData.js`
4. Keep demo data for `/developer` previews if useful

---

## Developer docs (`/developer`)

1. Open `/developer` → redirects to first doc (`/developer/order-details`)
2. Sidebar filters by category (`data-display` | `forms` | `common`) and search
3. Each doc shows: Import (with `@/data/demoData` where relevant), props, examples, live preview + variants

Source of truth:

- Docs text / examples → `src/developer/catalog.js`
- Live render → `src/developer/ComponentPreview.jsx`
- Page chrome → `src/pages/public_page/DeveloperPage.jsx`

Catalog `id`, `previewId`, and `ComponentPreview` switch cases must stay in sync (currently 13 components, aligned).

---

## Design tokens

`src/styles/variables.css`:

```css
:root {
  --active: #df900a; /* brand accent */
  --primary-text: #191c1f;
  --secondary-text: #4a5565;
}
```

Use `var(--active)` for primary actions / highlights. Global styles: `src/styles/globals.css` (Tailwind + variables).

---

## Data / auth flow

```text
pages → features/*Api.js (injectEndpoints on baseApi)
      → features/*Slice.js (local UI state)
      → data/demoData.js   (temporary)

Auth:
  guest pages     → PublicRoute
  logged-in pages → ProtectedRoute (+ role)
  session         → features/auth/authSlice.js
  tokens          → services/storage/localStorage.js
  HTTP headers    → services/api/interceptors.js
```

---

## i18n & SEO

- i18n bootstrap: `src/i18n/index.js`
- Strings: `src/i18n/locales/{en,pt,es}.json` (+ `locales/catalog/` for docs-related copy)
- SEO map: `src/config/seo.js` + route `handle.seo` or `<Seo />` (`components/common/Seo`)

---

## Naming conventions

| Item                    | Convention  | Example                           |
| ----------------------- | ----------- | --------------------------------- |
| Component folder / file | PascalCase  | `OrderDetails/OrderDetails.jsx`   |
| Barrel                  | `index.js`  | re-export default + named         |
| RTK API                 | `*Api.js`   | `authApi.js`                      |
| Slice                   | `*Slice.js` | `authSlice.js`                    |
| Page                    | `*Page.jsx` | `DisputesPage.jsx`                |
| Demo constants          | `DEMO_*`    | `DEMO_ORDER_NEW`                  |
| Imports                 | prefer `@/` | `import x from '@/data/demoData'` |

---

## Where to add new code

| Task                       | Location                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| New role screen            | 1) `pages/<role>/…/*Page.jsx` 2) **route** in `app/router/index.jsx` 3) sidebar item in `roles/<role>/index.js` |
| New shared display/form UI | `components/data-display` or `forms` + catalog + preview + demoData                                             |
| New auth field widget      | `components/auth/`                                                                                              |
| New RTK endpoints          | `features/<module>/<module>Api.js` + ensure store imports the Api module                                        |
| New mock payload           | `data/demoData.js`                                                                                              |
| Translation                | `i18n/locales/*.json`                                                                                           |
| SEO title                  | `config/seo.js`                                                                                                 |
| Env flag                   | `.env` + `config/env.js`                                                                                        |
| Sidebar link only          | `roles/<role>/index.js` (`nav`) — does **not** register a route                                                 |

---

## Agent / onboarding checklist

1. Read this README + skim `src/app/router/index.jsx` (all routes) and `src/roles/<role>/index.js` (sidebar only)
2. For UI work, open `/developer` and the matching entry in `catalog.js`
3. Import demos only from `@/data/demoData`
4. Prefer existing shared components over one-off page markup
5. Do not invent `DashboardLayout` or nest pages under `features/`
6. New page = file under `pages/` **and** explicit route in `router/index.jsx` **and** optional sidebar entry in `roles/`
7. `HomePage` is intentionally empty (`return null`) until marketing content lands — do not treat that as a broken route
8. `hooks/` and `utils/` are reserved; add files there when shared logic appears

---

## Scripts & tooling

| Script           | Command           |
| ---------------- | ----------------- |
| Dev server       | `npm run dev`     |
| Production build | `npm run build`   |
| Preview build    | `npm run preview` |
| ESLint           | `npm run lint`    |

Package name: `CONSTRUPRECO-frontend` (`package.json`).
