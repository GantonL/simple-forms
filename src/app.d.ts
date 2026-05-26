import type { Session, User } from 'better-auth';

declare module 'better-auth' {
	interface User {
		license_id?: string | null;
		plan_id?: string | null;
		expiration?: Date | string | null;
	}
}

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session;
			user: User;
			authHandler: (...args) => Response;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
