import { FormSubmissionCandidateDataTable } from '$lib/server/database/schemas/form';
import { lt, sql } from 'drizzle-orm';

export const defaultCreateDateFilter = lt(
	FormSubmissionCandidateDataTable.createdAt,
	sql`now() - interval '5 minutes'`
);
