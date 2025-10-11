# Simple Forms - Claude Code Guide

**Application**: Form management system - users create forms from templates, distribute via public links, collect signatures.

## Commands (Auto-use)

```bash
# Dev workflow
bun run dev           # start dev
bun run check         # type check - use before commits
bun run lint && bun run format  # code quality - use before commits

# Database
bun run local:db:up   # start PostgreSQL - use before dev/tests
bun run local:db:down # stop PostgreSQL
bun run test:server   # run DB tests - use after service changes
bun run db:push       # apply schema changes - use after schema edits

# Scaffolding
bun run create:page <path>              # new page
bun run create:md <filename>            # new markdown (all locales)
bun run create:api-controller <path>    # new API endpoint
```

## Tech Stack

SvelteKit 5 + TypeScript + Vite + Drizzle ORM + PostgreSQL + Tailwind 4 + shadcn-svelte + better-auth + sveltekit-i18n (he-IL/en-US RTL/LTR)

## Database Services Pattern

### Structure
```
src/lib/server/database/
├── services/
│   ├── provider.ts        # singleton provider
│   ├── factory.ts         # service factory (cached per table)
│   ├── abstract.ts        # base CRUD service
│   ├── utils.ts           # query builders
│   └── [table-name].ts    # table-specific service
└── schemas/
    └── [table-name].ts    # drizzle schema
```

### Service File Template (`services/[table-name].ts`)

```typescript
import { YourTable, type YourTableInsert } from '../schemas/your-table';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import { getBodyFiltersUtil, getUrlFiltersUtil, getUrlOptionsUtil, type BodyFiltersUtil } from './utils';
import type { Column } from 'drizzle-orm';

// Get cached service instance
export const Service = provider.getFactory().getService(YourTable);

// URL search filters (?q=search_term)
export const getUrlFilters = (url: URL): WhereCondition<typeof YourTable>[] => {
  return getUrlFiltersUtil(url, {
    searchColumns: [YourTable.name, YourTable.email] // searchable columns
  });
};

// Body filters (IDs, etc)
type YourTableFilters = BodyFiltersUtil; // extend if needed
const bodyFiltersConfig: Record<keyof YourTableFilters, Column> = {
  ids: YourTable.id
};
export const getBodyFilters = (filters: YourTableFilters): WhereCondition<typeof YourTable>[] => {
  return getBodyFiltersUtil(filters, bodyFiltersConfig);
};

// URL options (?limit=20&offset=40&orderBy=name,-createdAt)
export const getUrlOptions = (url: URL) => {
  return getUrlOptionsUtil(url, YourTable);
};

// Data builders - validation & transformation
type NewYourTable = Pick<YourTableInsert, 'name' | 'email'>;
export const buildCreateCandidates = (candidates: NewYourTable[]): NewYourTable[] => {
  return candidates.map(c => ({
    name: c.name,
    email: c.email
  }));
};

type UpdateYourTableData = Partial<NewYourTable>;
export const buildUpdateData = (data: UpdateYourTableData): UpdateYourTableData => {
  const validated: UpdateYourTableData = {};
  if (data?.name) validated.name = data.name;
  if (data?.email) validated.email = data.email;
  return validated;
};
```

### Rules
- Export `Service` as const from factory
- Export 4 functions: `getUrlFilters`, `getBodyFilters`, `getUrlOptions`, `buildCreateCandidates`, `buildUpdateData`
- Use utility functions from `services/utils.ts`
- Keep business logic in service file, not in API routes
- Validate/transform data in `build*` functions
- Never expose raw DB operations to API routes

## API Routes Pattern

### Structure
```
src/routes/api/
├── [resource]/
│   ├── +server.ts           # GET POST PUT DELETE
│   └── [id]/
│       └── +server.ts       # GET PUT DELETE by ID
```

### Template (`api/[resource]/+server.ts`)

```typescript
import {
  Service as service,
  getUrlFilters,
  getUrlOptions,
  buildCreateCandidates,
  buildUpdateData,
  getBodyFilters
} from '$lib/server/database/services/your-table';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const filters = getUrlFilters(url);
  const options = getUrlOptions(url);
  const items = await service.find(filters, options);
  return json(items);
};

export const POST: RequestHandler = async ({ request }) => {
  const { data } = await request.json();
  const itemsToCreate = buildCreateCandidates(data);
  const created = await service.createMany(itemsToCreate);
  return json({ created });
};

export const PUT: RequestHandler = async ({ url, request }) => {
  const { data, filters } = await request.json();
  const urlFilters = getUrlFilters(url);
  const bodyFilters = getBodyFilters(filters);
  const updateData = buildUpdateData(data);
  const updated = await service.updateWhere([...urlFilters, ...bodyFilters], updateData);
  return json({ updated });
};

export const DELETE: RequestHandler = async ({ url, request }) => {
  const { filters } = await request.json();
  const urlFilters = getUrlFilters(url);
  const bodyFilters = getBodyFilters(filters ?? []);
  const deleted = await service.deleteWhere([...urlFilters, ...bodyFilters]);
  return json({ deleted });
};
```

### Rules
- Import all 5 functions from service file
- Combine URL + body filters for PUT/DELETE
- Always use `build*` functions before mutations
- Return JSON with descriptive keys: `{ created }`, `{ updated }`, `{ deleted }`
- Use `?q=search&limit=20&offset=0&orderBy=name,-createdAt` format

## Component Structure

### Directory Rules
```
components/
├── [feature-name]/
│   ├── [feature-name].svelte       # main component
│   └── configurations/             # optional
│       └── [config-name].ts        # config objects
└── ui/                             # shadcn-svelte only
    └── [component]/
        ├── [component].svelte
        ├── index.ts
        └── [sub-components].svelte
```

### Component Rules
- Name folder = main file name
- Configuration objects go in `configurations/` subfolder as `.ts` files
- Use `$props()`, `$state()`, `$derived()` (Svelte 5 runes)
- Import UI components from `$lib/components/ui/[component]`
- Never create nested features in `ui/` - only shadcn components there

### Props Pattern
```typescript
type MyComponentProps = {
  data: DataType;
  config?: ConfigType;
  disabled?: boolean;
};

let { data, config, disabled }: MyComponentProps = $props();
```

## i18n Pattern

### Translation Files
```
src/lib/i18n/
├── en-US/
│   ├── common.json      # shared translations
│   └── [namespace].json # feature translations
└── he-IL/               # same structure
```

### Usage
```svelte
<script>
  import { t } from '$lib/i18n';
</script>

<!-- Template -->
<h1>{$t('common.title')}</h1>

<!-- TypeScript -->
<script>
  const title = t.get('common.title');
</script>
```

### Rules
- Namespace keys: `namespace.section.key`
- Use `common` for shared text
- Support params: `{{param}}`
- Both locales must have identical keys
- RTL/LTR handled automatically via `$direction` store

## Page Structure

### Routes
```
src/routes/
├── [[lang]]/                    # i18n wrapper
│   ├── (application)/           # auth-required pages
│   │   ├── +layout.server.ts    # load user session
│   │   └── dashboard/
│   │       ├── +page.svelte
│   │       └── +page.server.ts  # load data
│   ├── (public)/                # public pages (forms signing)
│   └── (site)/                  # static content (policies)
└── api/                         # API endpoints
```

### Page Data Loading
```typescript
// +page.server.ts
import { GET } from '$lib/api/helpers/request';
import { SearchParams } from '$lib/enums/search-params';
import type { MyTableSchema } from '$lib/server/database/schemas/[my-table-or-tables]';
import { APIRoutePath } from '../../../api';
import type { PageServerLoad } from './$types';

// SearchParams are not required, it depends on the route path, maybe it just uses a slug, need to check how you should use the route for a specific service
export const load: PageServerLoad = async ({ locals, fetch }) => {
  const userId = locals.user.id;
	const items = await GET<MyTableSchema[]>(`${APIRoutePath}?${SearchParams}=${userId}`, { fetch });
	return { items };
};

// +page.svelte
<script lang="ts">
  import { page } from '$app/state';
  const items = $derived(page.data.items);
</script>
```

### Rules
- Use `+page.server.ts` for DB queries
- Use `$derived()` for reactive page data
- Import data from `page.data`
- Never fetch from API routes in server load functions

## Feature Development Flow

### New Table/Resource
1. Run `bun run local:db:up`
2. Create schema in `schemas/[name].ts`
3. Run `bun run db:push`
4. Create service in `services/[name].ts` (use template above)
5. Run `bun run create:api-controller [name]`
6. Implement API route (use template above)
7. Run `bun run test:server` to verify
8. Create page with `bun run create:page /[name]`

### New UI Component
1. Create `components/[name]/[name].svelte`
2. Add config in `components/[name]/configurations/[config].ts` if needed
3. Import as `import Component from '$lib/components/[name]/[name].svelte'`
4. Use i18n for all user-facing text

### Bug Fixes
1. Check if test exists in `services/*.test.ts`
2. Run `bun run check` for type errors
3. Run `bun run lint && bun run format` before commit

## Critical Patterns

### Service Usage
```typescript
// ✅ Correct
import { Service } from '$lib/server/database/services/users';
const user = await Service.findById(1);

// ❌ Wrong - don't instantiate directly
import { AbstractService } from '$lib/server/database/services/abstract';
new AbstractService(db, table);
```

### Filter Building
```typescript
// ✅ Correct - use service functions
const urlFilters = getUrlFilters(url);
const bodyFilters = getBodyFilters({ ids: [1, 2, 3] });
await Service.find([...urlFilters, ...bodyFilters], options);

// ❌ Wrong - raw drizzle queries
await db.select().from(table).where(eq(table.id, 1));
```

### Component Data
```typescript
// ✅ Correct - derive from page data
const items = $derived(page.data.items);

// ❌ Wrong - fetching in component
onMount(async () => {
  items = await fetch('/api/items').then(r => r.json());
});
```

## Business Logic

Application manages form templates → user instances → public signing.
- **Form Templates**: JSON schema definitions (admin-created)
- **User Forms**: Instances created by users from templates
- **Public Links**: Shareable URLs for form signing (`/f/[slug]`)
- **Submissions**: Signed form data with timestamps

When adding features, maintain: template → instance → submission flow.
