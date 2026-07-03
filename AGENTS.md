<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Creon Web

## Project Overview

**Creon** is a Web3 crowdfunding platform for Indonesian micro, small, and medium enterprises (UMKM), built on the **Stellar network**. It connects entrepreneurs who need capital with investors who want to fund them.

Key technologies:
- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui** (`radix-lyra` style preset)
- **TanStack Query v5** for server-state management
- **Zustand v5** for client-state management
- **React Hook Form** + **Zod v4** for form validation
- **Phosphor Icons** as the icon library
- **pnpm** as the package manager

See [`docs/PROJECT.md`](./docs/PROJECT.md) for full domain/business context (roles, core flow, glossary).

---

## Setup Commands

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env-example .env   # then fill in values

# Start development server
pnpm dev
```

---

## Development Workflow

```bash
pnpm dev        # Start dev server (localhost:3000)
pnpm build      # Production build
pnpm start      # Serve production build
pnpm lint       # Run ESLint (eslint .)
pnpm format     # Prettier write (all .ts/.tsx files)
pnpm typecheck  # TypeScript check without emitting (tsc --noEmit)
```

Always run `pnpm lint` and `pnpm typecheck` before committing.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router — pages & layouts only
│   ├── admin/                  # Admin portal routes
│   │   └── layout.tsx
│   ├── entrepreneur/           # Entrepreneur portal routes
│   │   └── layout.tsx
│   ├── investor/               # Investor portal routes
│   │   └── layout.tsx
│   ├── layout.tsx              # Root layout (fonts, global providers)
│   ├── page.tsx                # Landing/home page
│   └── globals.css             # Global styles + Tailwind CSS v4 tokens
│
├── modules/                    # Feature modules (domain-driven slices)
│   │                           # Each module is a self-contained vertical slice.
│   └── example-module/         # Example module
│       ├── api/                # API call functions & TanStack Query hooks for this module
│       ├── components/         # UI components scoped to this module
│       ├── hooks/              # React hooks scoped to this module
│       ├── stores/             # Zustand stores for this module
│       ├── types/              # TypeScript types used within this module
│       ├── utils/              # Utility/helper functions for this module
│       └── index.ts            # ← Public barrel export (ONLY cross-module import point)
│
└── shared/                     # Cross-cutting concerns (no business logic)
    ├── components/
    │   ├── shadcn-ui/          # All shadcn/ui components (installed via CLI)
    │   ├── typography/         # Typography components
    │   └── theme-provider.tsx  # next-themes provider
    ├── constants/              # App-wide constants
    ├── hooks/
    │   └── use-mobile.ts       # Responsive breakpoint hook
    ├── lib/
    │   ├── api-client.ts       # ← Fetch wrapper (api.get/post/put/patch/delete)
    │   ├── env.ts              # Environment variable schema (@t3-oss/env-nextjs)
    │   └── react-query/        # TanStack Query provider & default config
    ├── stores/                 # Global Zustand stores
    ├── types/                  # Shared TypeScript types
    └── utils/
        └── cn.ts               # cn() utility (clsx + tailwind-merge)
```

### Module anatomy

Every feature module under `src/modules/<name>/` must follow this structure:

| Folder | Purpose |
|--------|---------|
| `api/` | API request functions (using `api` wrapper) and TanStack Query hooks (`useQuery`, `useMutation`) |
| `components/` | React components that belong exclusively to this module |
| `hooks/` | Custom React hooks scoped to this module |
| `stores/` | Zustand state stores for this module |
| `types/` | TypeScript interfaces and types used within this module |
| `utils/` | Pure utility/helper functions for this module |
| `index.ts` | **Public barrel export** — the only file other modules may import from |

> **Rule:** all exports intended to be used outside the module must be re-exported from `index.ts`. Internal files are private implementation details.

---

## Module Boundary Rules (IMPORTANT)

**Cross-module imports must always go through the barrel `index.ts`.**

```ts
// ✅ Correct — import through the public barrel
import { useAuthUser } from "@/modules/auth"

// ❌ Wrong — deep import into another module's internals
import { useAuthUser } from "@/modules/auth/hooks/use-auth-user"
```

ESLint enforces this with the custom `local/no-cross-module-deep-imports` rule (see [`eslint.config.mjs`](./eslint.config.mjs)). A module may freely import from its own subfolders.

**Path aliases:**
- `@/*` → `src/*`
- `@shadcn-ui/*` → `src/shared/components/shadcn-ui/*`

---

## Code Style

- **TypeScript strict mode** is enabled; avoid `any`.
- **No semicolons** (Prettier: `"semi": false`).
- **Double quotes** (`"singleQuote": false`).
- **2-space indentation**, `printWidth: 80`.
- **Trailing commas** in ES5 positions.
- **Tailwind class order** is enforced by `prettier-plugin-tailwindcss`. Always run Prettier after editing JSX.
- Use `cn()` (from `@/shared/utils/cn`) to merge Tailwind classes — never concatenate class strings manually.
- Use CVA (`class-variance-authority`) for component variants.

---

## Adding shadcn Components

shadcn components are installed to `src/shared/components/shadcn-ui/`. Use the CLI:

```bash
pnpm shadcn add <component-name>
```

Import them via the `@shadcn-ui/*` path alias:

```ts
import { Button } from "@shadcn-ui/button"
```

---

## API Communication (IMPORTANT)

**All HTTP requests to the backend must go through the `api` wrapper in [`src/shared/lib/api-client.ts`](./src/shared/lib/api-client.ts).** Never call `fetch()` directly.

```ts
// ✅ Correct — use the api wrapper
import { api } from "@/shared/lib/api-client"

// ❌ Wrong — raw fetch is not allowed
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campaigns`)
```

The wrapper (`api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`) handles:
- **Base URL** injection from `env.NEXT_PUBLIC_BASE_API_URL`
- **Content-Type / Accept** headers
- **Cookie forwarding** for SSR (server-side requests)
- **Query params** serialization via the `params` option
- **Error throwing** on non-2xx responses (throws `Error` with message from API body)
- **`credentials: "include"`** for session cookies

### `RequestOptions` reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `params` | `Record<string, string \| number \| boolean \| undefined \| null>` | — | Query string parameters (nulls/undefineds are stripped) |
| `cache` | `RequestCache` | `"no-store"` | Next.js fetch cache strategy |
| `next` | `NextFetchRequestConfig` | — | Next.js ISR/revalidation config |
| `headers` | `Record<string, string>` | — | Extra headers merged on top of defaults |
| `signal` | `AbortSignal` | — | Cancellation signal |

---

### Step 1 — Dedicated API function (always required)

Wrap every endpoint in a named function inside the module's `api/` folder. **Do not call `api.*` inline inside components or hooks.**

```ts
// src/modules/campaign/api/get-campaign-by-id.ts
import { api } from "@/shared/lib/api-client"
import { Campaign } from "../types"

export type GetCampaignByIdInput = {
  id: string
}

export const getCampaignById = ({
  id,
}: GetCampaignByIdInput): Promise<Campaign> => {
  return api.get<Campaign>(`/campaigns/${id}`)
}
```

```ts
// src/modules/campaign/api/create-campaign.ts
import { api } from "@/shared/lib/api-client"
import { Campaign, CreateCampaignInput } from "../types"

export const createCampaign = (
  data: CreateCampaignInput
): Promise<Campaign> => {
  return api.post<Campaign>("/campaigns", data)
}
```

---

### Step 2 — Query / Mutation hooks (required for client components)

If the API function is consumed by a **Client Component**, also create a TanStack Query hook in the same `api/` folder.
Use the utility types from [`src/shared/lib/react-query/query-config.ts`](./src/shared/lib/react-query/query-config.ts):

| Type utility | Use for |
|---|---|
| `QueryConfig<T>` | Typing the `config` param of a `useQuery` hook |
| `MutationConfig<T>` | Typing the `config` param of a `useMutation` hook |
| `ApiFnReturnType<T>` | Extracting the resolved return type of an API function |

**`useQuery` hook example:**

```ts
// src/modules/campaign/api/get-campaign-by-id.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { Campaign } from "../types"

export type GetCampaignByIdInput = { id: string }

export const getCampaignById = ({
  id,
}: GetCampaignByIdInput): Promise<Campaign> =>
  api.get<Campaign>(`/campaigns/${id}`)

export const getCampaignByIdQueryOptions = ({ id }: GetCampaignByIdInput) => ({
  queryKey: ["campaigns", id],
  queryFn: () => getCampaignById({ id }),
})

type UseGetCampaignByIdOptions = GetCampaignByIdInput & {
  config?: QueryConfig<typeof getCampaignByIdQueryOptions>
}

export const useGetCampaignById = ({
  id,
  config,
}: UseGetCampaignByIdOptions) => {
  return useQuery({
    ...getCampaignByIdQueryOptions({ id }),
    ...config,
  })
}
```

**`useMutation` hook example:**

```ts
// src/modules/campaign/api/create-campaign.ts
import { useMutation } from "@tanstack/react-query"
import { api } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { Campaign, CreateCampaignInput } from "../types"

export const createCampaign = (
  data: CreateCampaignInput
): Promise<Campaign> => api.post<Campaign>("/campaigns", data)

type UseCreateCampaignOptions = {
  config?: MutationConfig<typeof createCampaign>
}

export const useCreateCampaign = ({ config }: UseCreateCampaignOptions = {}) => {
  return useMutation({
    mutationFn: createCampaign,
    ...config,
  })
}
```

> **Rule:** keep the plain API function and its Query/Mutation hook in the **same file** inside the module's `api/` folder. Export both through the module's `index.ts`.

---

## Environment Variables

Environment variables are validated with `@t3-oss/env-nextjs`. Add new vars to the env schema (in `src/shared/lib/env.ts` or equivalent) **before** using them — raw `process.env` access is not allowed.

---

## Pull Request Guidelines

- **Title format:** `[scope] Brief description` — e.g., `[campaign] Add funding progress bar`
- Run the full check suite before opening a PR:
  ```bash
  pnpm lint && pnpm typecheck && pnpm build
  ```
- Each new module must export its public API from `index.ts`.
- Do not expose internal module paths to other modules.

---

## Common Gotchas

- This project uses **Next.js 16** — APIs may differ significantly from Next.js 13/14/15. Always check `node_modules/next/dist/docs/` before writing Next.js-specific code.
- **React 19** is used. Hooks and patterns may differ from React 18.
- **Tailwind CSS v4** is used (`@tailwindcss/postcss`). Configuration is CSS-first — there is no `tailwind.config.ts`.
- **Zod v4** has breaking API changes from v3. Refer to Zod v4 docs.
- shadcn style preset is `radix-lyra` (not the default `new-york` or `default`). Do not change the style in `components.json`.
