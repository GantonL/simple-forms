import { db } from '$lib/server/database/client';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { account, session, user, verification } from '../database/schemas/auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { customSession } from 'better-auth/plugins';
import { userFsEntitlements } from '../database/schemas/entitlements';
import { eq, desc } from 'drizzle-orm';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification
		}
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const entitlements = await db
				.select()
				.from(userFsEntitlements)
				.where(eq(userFsEntitlements.userId, user.id))
				.orderBy(desc(userFsEntitlements.createdAt));
			return {
				...session,
				user: {
					...user,
					license_id: entitlements?.[0]?.fsLicenseId,
					plan_id: entitlements?.[0]?.fsPlanId,
					expiration: entitlements?.[0]?.expiration
				}
			};
		}),
		sveltekitCookies(getRequestEvent) //always keep last
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // Cache duration in seconds
		}
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ['x-forwarded-for']
		}
	}
});
