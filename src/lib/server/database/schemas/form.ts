import { integer, jsonb, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { TemplatesKeys } from '$lib/enums/templates-keys';

export const FormTemplateTable = pgTable('form_template', {
	id: serial('id').primaryKey(),
	key: text('key').$type<TemplatesKeys>().unique(),
	schema: jsonb('schema').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export type FormTemplate = typeof FormTemplateTable.$inferSelect;
export type FormTemplateTableInsert = typeof FormTemplateTable.$inferInsert;

export const UserFormTable = pgTable('user_form', {
	id: serial('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	template_id: integer('template_id')
		.notNull()
		.references(() => FormTemplateTable.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	public_link_identifier: uuid('public_link_identifier').defaultRandom(),
	submissions: integer('submissions')
});

export type UserForm = typeof UserFormTable.$inferSelect;
export type UserFormTableInsert = typeof UserFormTable.$inferInsert;

export const FormSubmissionTable = pgTable('form_submission', {
	id: serial('id').primaryKey(),
	user_form_id: integer('user_form_id')
		.notNull()
		.references(() => UserFormTable.id),
	data: jsonb('data').notNull(),
	storage_url: text('storage_url'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export type FormSubmission = typeof FormSubmissionTable.$inferSelect;
export type FormSubmissionInsert = typeof FormSubmissionTable.$inferInsert;
