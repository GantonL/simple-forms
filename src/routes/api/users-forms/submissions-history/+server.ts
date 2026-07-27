import { json, type RequestHandler } from '@sveltejs/kit';
import {
	getUrlFilters as submissionsUrlFilters,
	Service as submissionsService
} from '$lib/server/database/services/form-submissions';
import {
	getUrlFilters as userFormsUrlFilters,
	getUrlOptions as userFormsUrlOptions,
	Service as userFormsService
} from '$lib/server/database/services/user-form';
import { FormSubmissionTable } from '$lib/server/database/schemas/form';
import { sql } from 'drizzle-orm';
import type { BarChartData } from '$lib/models/chart';
import { getFullFormattedDate } from '$lib/utils';
import type { QueryOptions } from '$lib/server/database/services/abstract';
import { DEFAULT_LIMIT } from '$lib/api/configurations/common';
import { SearchParams } from '$lib/enums/search-params';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	if (user?.id) {
		url.searchParams.append(SearchParams.UserId, user.id);
	}
	const userFormsFilters = userFormsUrlFilters(url);
	const userFormsOptions = userFormsUrlOptions(url);
	const formsToQueryFor = await userFormsService.find(userFormsFilters, userFormsOptions);
	if (!formsToQueryFor || formsToQueryFor.length === 0) {
		return json([]);
	}

	url.searchParams.append(SearchParams.FormId, formsToQueryFor.map((f) => f.id).join(','));
	const submissionsFilters = submissionsUrlFilters(url);
	const submissionsOptions: QueryOptions = { limit: DEFAULT_LIMIT };
	const formattedCreateAt = sql`DATE_TRUNC('day', ${FormSubmissionTable.createdAt})::date AS dayFormattedCreatedAt`;
	submissionsOptions.select = {
		dayFormattedCreatedAt: formattedCreateAt.mapWith(String),
		count: sql`COUNT(*) AS total_submissions`,
		userFormId: FormSubmissionTable.user_form_id
	};
	submissionsOptions.groupBy = sql`
	    dayFormattedCreatedAt,
			${FormSubmissionTable.user_form_id}
	`;
	submissionsOptions.orderBy = sql`dayFormattedCreatedAt DESC`;
	const items = (await submissionsService.find(
		submissionsFilters,
		submissionsOptions
	)) as unknown as {
		dayFormattedCreatedAt: string;
		count: number;
		userFormId: number;
	}[];
	const groupedByDay = Object.groupBy(items, (item) => item.dayFormattedCreatedAt);
	type groupedHistoryItemResult = BarChartData & { data: Record<string, unknown> };
	const results: groupedHistoryItemResult[] = Object.keys(groupedByDay).map((key) => {
		const values = groupedByDay[key];
		const result: groupedHistoryItemResult = {
			x: getFullFormattedDate(new Date(key), {
				day: 'numeric',
				month: 'short'
			}),
			data: {}
		};
		formsToQueryFor?.forEach((form, i) => {
			const value = values!.find((v) => v.userFormId === form.id);
			result[`form${i + 1}`] = Number(value?.count ?? 0);
			result.data[`form${i + 1}`] = { name: form.name };
		});
		return result;
	});
	return json(results.reverse());
};
