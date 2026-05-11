import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const userFsEntitlements = pgTable('user_fs_entitlements', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	fsLicenseId: varchar('fs_license_id', { length: 255 }).unique().notNull(),
	fsPlanId: varchar('fs_plan_id', { length: 255 }).notNull(),
	fsPricingId: varchar('fs_pricing_id', { length: 255 }),
	fsUserId: varchar('fs_user_id', { length: 255 }).notNull(),
	type: varchar('type', { length: 50 }), // e.g., subscription, lifetime
	expiration: timestamp('expiration'),
	isCanceled: boolean('is_canceled').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});
