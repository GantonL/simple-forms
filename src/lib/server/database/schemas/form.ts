import {
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
	boolean
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { TemplatesKeys } from '$lib/enums/templates-keys';
import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
import type { UserFormData } from '$lib/models/user-form-data';
import type { FormSettingsNofitication } from '$lib/models/form-settings-notification';

export const FormTemplateTable = pgTable('form_template', {
	id: serial('id').primaryKey(),
	key: text('key').$type<TemplatesKeys>().unique(),
	schema: jsonb('schema').$type<FormTemplateSchema>().notNull(),
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
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	public_link_identifier: uuid('public_link_identifier').defaultRandom(),
	submissions: integer('submissions').notNull().default(0),
	data: jsonb('data').$type<UserFormData>(),
	is_active: boolean().default(true)
});

export type UserForm = typeof UserFormTable.$inferSelect;
export type UserFormTableInsert = typeof UserFormTable.$inferInsert;

export const FormSubmissionTable = pgTable('form_submission', {
	id: serial('id').primaryKey(),
	user_form_id: integer('user_form_id')
		.notNull()
		.references(() => UserFormTable.id),
	storage_url: text('storage_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	display_data: jsonb('display_data').$type<Record<string, unknown>>()
});

export type FormSubmission = typeof FormSubmissionTable.$inferSelect;
export type FormSubmissionInsert = typeof FormSubmissionTable.$inferInsert;

export const FormSubmissionCandidateDataTable = pgTable('form_submission_candidate_data', {
	id: serial('id').primaryKey(),
	user_form_id: integer('user_form_id')
		.notNull()
		.references(() => UserFormTable.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	data: jsonb('data').$type<UserFormData>()
});

export type FormSubmissionCandidateDataSelect =
	typeof FormSubmissionCandidateDataTable.$inferSelect;
export type FormSubmissionCandidateDataInsert =
	typeof FormSubmissionCandidateDataTable.$inferInsert;

export const FormSettingsTable = pgTable('form_settings', {
	id: serial('id').primaryKey(),
	user_form_id: integer('user_form_id')
		.notNull()
		.references(() => UserFormTable.id),
	notifications: jsonb('notifications').$type<FormSettingsNofitication>()
});

export type FormSettingsSelect = typeof FormSettingsTable.$inferSelect;
export type FormSettingsInsert = typeof FormSettingsTable.$inferInsert;
