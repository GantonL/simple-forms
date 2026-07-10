import { json, type RequestHandler } from '@sveltejs/kit';
import {
	getUrlFilters,
	getUrlOptions,
	Service as service
} from '$lib/server/database/services/form-submissions';
import { SearchParams } from '$lib/enums/search-params';
import { FormSubmissionTable } from '$lib/server/database/schemas/form';
import { sql } from 'drizzle-orm';
import type { BarChartData } from '$lib/models/chart';
import { getFullFormattedDate } from '$lib/utils';

export const GET: RequestHandler = async ({ params, url }) => {
	url.searchParams.append(SearchParams.FormId, String(params.user_form_id));
	const filters = getUrlFilters(url);
	const options = getUrlOptions(url);
	const formattedCreateAt = sql`DATE_TRUNC('day', ${FormSubmissionTable.createdAt})::date AS dayFormattedCreatedAt`;
	options.select = {
		dayFormattedCreatedAt: formattedCreateAt.mapWith(String),
		count: sql`COUNT(*) AS total_submissions`
	};
	options.groupBy = sql`dayFormattedCreatedAt`;
	options.orderBy = sql`dayFormattedCreatedAt DESC`;
	const items = (await service.find(filters, options)) as unknown as {
		dayFormattedCreatedAt: string;
		count: number;
	}[];
	const results: BarChartData[] = items.map((i) => {
		return {
			x: getFullFormattedDate(new Date(i.dayFormattedCreatedAt), {
				day: 'numeric',
				month: 'short'
			}),
			y: Number(i.count)
		};
	});
	return json(results.reverse());
};
