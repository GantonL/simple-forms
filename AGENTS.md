# AGENTS.md - AI Coding Agent Guidelines

Form management system: create forms from templates, distribute via public links, collect signatures.

## Tech Stack

SvelteKit 5 | TypeScript (strict) | Vite 6 | Drizzle ORM | PostgreSQL | Tailwind 4 | shadcn-svelte | better-auth | sveltekit-i18n (he-IL/en-US RTL/LTR) | Bun

## Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Production build
bun run check            # TypeScript check (run before commits)
bun run lint             # Prettier + ESLint check
bun run format           # Auto-format with Prettier

# Database
bun run local:db:up      # Start PostgreSQL (required before dev/tests)
bun run local:db:down    # Stop PostgreSQL
bun run db:push          # Apply schema changes
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations

# Testing
bun run test:server      # Run all Vitest tests
bunx vitest run src/lib/server/database/services/tests/users.test.ts        # Single test file
bunx vitest run -t "should create user"                                      # Single test by name
bunx vitest run src/lib/server/database/services/tests/ --reporter=verbose  # Verbose output

# Scaffolding
bun run create:page <path>            # New page
bun run create:md <filename>          # New markdown (all locales)
bun run create:api-controller <path>  # New API endpoint
```

## Code Style

### Formatting (Prettier)

- Tabs for indentation
- Single quotes
- No trailing commas
- 100 char line width
- Tailwind class sorting enabled

### Naming Conventions

| Type                | Convention                           | Example                            |
| ------------------- | ------------------------------------ | ---------------------------------- |
| Files               | kebab-case                           | `user-form.ts`, `form-card.svelte` |
| Types/Interfaces    | PascalCase                           | `UserForm`, `FormTemplate`         |
| Variables/Functions | camelCase                            | `getUrlFilters`, `buildData`       |
| Enums               | PascalCase                           | `SearchParams.UserId`              |
| DB columns          | snake_case                           | `user_id`, `created_at`            |
| API routes          | kebab-case                           | `/api/user-forms`                  |
| Components          | kebab-case folder, same-name .svelte | `form-card/form-card.svelte`       |

### Import Order

```typescript
// 1. External dependencies
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// 2. $lib aliases
import { Service } from '$lib/server/database/services/users';
import Button from '$lib/components/ui/button/button.svelte';

// 3. Relative imports
import { getUrlFilters } from './utils';
import type { UserSchema } from '../schemas/users';
```

### TypeScript

- Strict mode enabled - no `any` types
- Use `type` for object shapes, `interface` for extensible contracts
- Explicit return types on exported functions
- Prefer `$derived()` over manual reactivity

## Architecture Patterns

### Service Layer (`src/lib/server/database/services/`)

```typescript
// Always export these 5 items per service:
export const Service = provider.getFactory().getService(TableName);
export const getUrlFilters = (url: URL) => {...};
export const getBodyFilters = (filters: F) => {...};
export const getUrlOptions = (url: URL) => {...};
export const buildCreateCandidates = (data: D[]) => {...};
export const buildUpdateData = (data: D) => {...};
```

### API Routes (`src/routes/api/`)

```typescript
import {
	Service,
	getUrlFilters,
	getUrlOptions,
	buildCreateCandidates,
	buildUpdateData,
	getBodyFilters
} from '$lib/server/database/services/[table]';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	return json(await Service.find(filters, options));
};

export const POST: RequestHandler = async ({ request }) => {
	const { data } = await request.json();
	const created = await Service.createMany(buildCreateCandidates(data));
	return json({ created });
};
```

### Svelte 5 Components

```svelte
<script lang="ts">
	type Props = { data: DataType; onAction?: (id: string) => void };
	let { data, onAction }: Props = $props();

	let localState = $state(initialValue);
	const computed = $derived(data.items.length);
</script>
```

### Page Data Loading

```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ locals, fetch }) => {
	const items = await GET<ItemSchema[]>(`${APIRoutePath}?userId=${locals.user.id}`, { fetch });
	return { items };
};

// +page.svelte - use $derived for reactivity
const items = $derived(page.data.items);
```

## Critical Rules

### DO

- Use service factory pattern: `provider.getFactory().getService(Table)`
- Combine URL + body filters in PUT/DELETE
- Use `build*` functions before mutations
- Run `bun run check && bun run lint` before commits
- Start DB with `bun run local:db:up` before testing
- Use scaffolding scripts for new pages/routes

### DON'T

- Instantiate services directly (use factory)
- Write raw Drizzle queries in API routes
- Fetch from API routes in `+page.server.ts` load functions
- Create components in `ui/` folder (shadcn only)
- Use `any` types
- Skip `build*` validation functions

## Project Structure

```
src/
├── lib/
│   ├── api/helpers/           # Request utilities (GET/POST/PUT/DELETE)
│   ├── components/
│   │   ├── [feature]/         # Feature components with configurations/
│   │   └── ui/                # shadcn-svelte only
│   ├── enums/                 # TypeScript enums
│   ├── i18n/{en-US,he-IL}/    # Translations (must match keys)
│   ├── models/                # TypeScript types/interfaces
│   └── server/database/
│       ├── schemas/           # Drizzle schemas
│       └── services/          # Service layer + tests/
├── routes/
│   ├── [[lang]]/              # i18n wrapper
│   │   ├── (application)/     # Auth-required
│   │   ├── (public)/          # Public forms
│   │   └── (site)/            # Static content
│   └── api/                   # REST endpoints
└── scripts/                   # Scaffolding
```

## Testing

Tests live in `src/lib/server/database/services/tests/`. Pattern:

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';

describe('ServiceName', () => {
	beforeAll(async () => {
		/* DB setup */
	});
	afterEach(async () => {
		/* cleanup created records */
	});
	afterAll(async () => {
		/* teardown */
	});

	it('should perform action', async () => {
		// Arrange
		const input = buildCreateCandidates([{ name: 'Test' }]);
		// Act
		const result = await Service.createMany(input);
		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Test');
	});
});
```

## i18n

- Namespace format: `namespace.section.key`
- Use `$t('common.title')` in templates
- Use `t.get('common.key')` in TypeScript
- Both locales must have identical keys
- RTL/LTR via `$direction` store

## Error Handling

- Services: throw `Error()` for validation failures
- API routes: return `json({ error: message }, { status: code })`
- Client: Toast notifications for user feedback
- Always use async/await with try/catch for DB operations
