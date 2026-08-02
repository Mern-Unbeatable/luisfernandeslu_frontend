# Frontend Folder Structure

This document describes the **exact folder structure used in this project**.  
Copy the same layout into a new React + Vite app and follow the same rules.

---

## Root

```text
frontend/
├── public/
├── src/
├── .env
├── .env.example
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Full `src/` tree (this project)

```text
src/
├── main.jsx
├── App.jsx
├── index.css
│
├── config/
│   └── env.js
│
├── routes/
│   ├── router.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
│
├── api/
│   ├── index.js
│   ├── auth.api.js
│   ├── member.api.js
│   ├── staff.api.js          # calls backend /api/staff (concierge)
│   ├── admin.api.js
│   ├── messages.api.js
│   └── notifications.api.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useApiError.js
│   ├── useMessages.js
│   ├── useMessageSocket.js
│   ├── useNominatim.js
│   └── api/
│       ├── index.js
│       ├── useAuthQueries.js
│       ├── useMemberQueries.js
│       ├── useStaffQueries.js
│       ├── useAdminQueries.js
│       ├── useMessageQueries.js
│       └── useNotificationQueries.js
│
├── lib/
│   ├── api/
│   │   ├── axios.js
│   │   ├── http.js
│   │   ├── interceptors.js
│   │   ├── tokenStorage.js
│   │   ├── refreshAccessToken.js
│   │   ├── authSession.js
│   │   ├── unwrapResponse.js
│   │   ├── ApiError.js
│   │   └── index.js
│   ├── auth/
│   │   └── betterAuthClient.js
│   ├── socket/
│   │   └── socketClient.js
│   ├── query/
│   │   ├── queryClient.js
│   │   ├── queryKeys.js
│   │   └── index.js
│   └── messages/
│       └── messageUtils.js
│
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── authApiSlice.js
│   │   └── dummyAuth.js
│   ├── member/
│   │   └── memberApiSlice.js
│   ├── concierge/
│   │   └── conciergeApiSlice.js
│   └── admin/
│       └── adminApiSlice.js
│
├── app/
│   ├── store.js
│   ├── apiSlice.js
│   └── providers/
│       └── AppProviders.jsx
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   └── public/
│   │       ├── PublicLayout.jsx
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── ExperienceBanner.jsx
│   ├── common/
│   │   ├── Pagination.jsx
│   │   ├── PasswordInput.jsx
│   │   ├── skeletons/
│   │   └── messenger/
│   └── flight-demand-calendar/
│
├── pages/
│   ├── public/
│   │   ├── Home/
│   │   ├── Membership/
│   │   ├── Terms/
│   │   ├── FAQ/
│   │   ├── Contact/
│   │   ├── login/
│   │   ├── register/
│   │   ├── payment-success/
│   │   ├── forgot-password/
│   │   ├── varify-otp/
│   │   └── reset-password/
│   │
│   ├── member/
│   │   ├── overview/
│   │   ├── travel-opportunities/
│   │   ├── pending-reservations/
│   │   ├── upcoming-trips/
│   │   ├── travel-preferences/
│   │   ├── custom-travel/
│   │   ├── message/
│   │   ├── notification/
│   │   └── profile/
│   │
│   ├── concierge/
│   │   ├── dashboard/
│   │   ├── calendar-demand/
│   │   ├── member-interest/
│   │   ├── opportunities/
│   │   ├── travel-preferences/
│   │   ├── message/
│   │   └── Profile.jsx
│   │
│   └── admin/
│       ├── dashboard-overview/
│       ├── members/
│       ├── concierge-staff/
│       ├── support/
│       └── settings/
│
├── assets/
└── utils/
    └── paymentAlerts.js
```

---

## What each top-level folder does

| Folder | Purpose |
|--------|---------|
| `config/` | Environment variables (`VITE_API_URL`, etc.) |
| `routes/` | All URLs + login/role guards |
| `api/` | Backend HTTP calls (one file per API area) |
| `hooks/` | React logic + TanStack Query hooks |
| `lib/` | Axios, auth, socket, query client (no UI) |
| `features/` | Redux slices |
| `app/` | Redux store + providers |
| `components/` | UI shared across multiple pages |
| `pages/` | Screens — grouped by user area |
| `assets/` | Images, fonts |
| `utils/` | Small helper functions |

---

## `pages/` rule

Pages are split into **4 areas**:

```text
pages/public/      → anyone (marketing + login/register)
pages/member/      → logged-in members
pages/concierge/   → logged-in concierge users
pages/admin/       → logged-in admins
```

**Each feature folder looks like this:**

```text
pages/member/profile/
├── Profile.jsx              # main page
├── profileUtils.js          # optional helpers
└── components/              # only used on this page
    ├── PersonalInfoForm.jsx
    └── PasswordForm.jsx
```

| Put in `pages/.../components/` | Put in `components/common/` |
|--------------------------------|-----------------------------|
| UI for one page only | Navbar, pagination, skeletons, messenger |
| Feature-specific forms/tables | Layout shells |

---

## Routes (this project)

Defined in `routes/router.jsx`.

| URL prefix | Folder | Role |
|------------|--------|------|
| `/` | `pages/public/` | public |
| `/login`, `/register`, … | `pages/public/` | public (guest only) |
| `/member/*` | `pages/member/` | `member` |
| `/concierge/*` | `pages/concierge/` | `concierge` |
| `/admin/*` | `pages/admin/` | `admin` |

Add a new page:

1. Create folder under the correct `pages/<area>/`
2. Register route in `routes/router.jsx`
3. Add API in `api/` if needed
4. Add hook in `hooks/api/` if needed

---

## API layer

```text
api/auth.api.js           → /api/auth
api/member.api.js         → /api/member
api/staff.api.js          → /api/staff        (concierge backend routes)
api/admin.api.js          → /api/admin
api/messages.api.js       → /api/messages
api/notifications.api.js  → /api/notifications
```

Hooks mirror API files:

```text
hooks/api/useAuthQueries.js
hooks/api/useMemberQueries.js
hooks/api/useStaffQueries.js      → uses staff.api.js
hooks/api/useAdminQueries.js
hooks/api/useMessageQueries.js
hooks/api/useNotificationQueries.js
```

**Flow:**

```text
Page → hooks/api/useXQueries.js → api/x.api.js → lib/api/http.js → backend
```

---

## Auth & session

```text
pages/public/login/     → hooks/useAuth.js → api/auth.api.js
features/auth/authSlice.js   (user, token, isAuthenticated)
lib/api/tokenStorage.js      (cookies)
lib/api/interceptors.js      (Bearer header + refresh)
routes/ProtectedRoute.jsx    (block by role)
```

---

## Shared components

```text
components/layout/DashboardLayout.jsx   → sidebar for member / concierge / admin
components/layout/public/               → marketing site shell
components/common/skeletons/              → loading UI per page
components/common/messenger/              → chat UI (member + concierge)
components/common/Pagination.jsx
components/common/PasswordInput.jsx
components/flight-demand-calendar/      → shared calendar widget
```

---

## Where to go for common tasks

| Task | Go to |
|------|--------|
| New page URL | `routes/router.jsx` + `pages/<area>/<feature>/` |
| New API call | `api/*.api.js` + `hooks/api/use*Queries.js` |
| Login / logout | `hooks/useAuth.js`, `features/auth/`, `lib/api/` |
| Member screen | `pages/member/` |
| Concierge screen | `pages/concierge/` |
| Admin screen | `pages/admin/` |
| Marketing / auth page | `pages/public/` |
| Navbar / footer | `components/layout/public/` |
| Chat / socket | `lib/socket/`, `hooks/useMessageSocket.js`, `components/common/messenger/` |
| API base URL | `.env` + `config/env.js` |

---

## Naming rules

| Item | Rule | Example |
|------|------|---------|
| Page folder | kebab-case | `travel-preferences/` |
| Page file | PascalCase | `TravelPreferences.jsx` |
| API file | `<name>.api.js` | `member.api.js` |
| Query hook | `use<Name>Queries.js` | `useMemberQueries.js` |
| Page utils | camelCase | `opportunityUtils.js` |

---

## Copy to a new project

1. Copy the `src/` folder layout from the tree above.
2. Keep the same folder names (`api`, `hooks`, `lib`, `pages`, etc.).
3. Under `pages/`, create one folder per **user area** your app needs (rename `member` / `concierge` / `admin` only if your product has different roles).
4. Under `api/` and `hooks/api/`, add one file per backend module.
5. Put page-only components inside `pages/<area>/<feature>/components/`.
6. Put reusable UI in `components/`.

---

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Env

```env
VITE_API_URL=https://your-api.com/api
VITE_SOCKET_URL=https://your-api.com
```

Read in `src/config/env.js`.
