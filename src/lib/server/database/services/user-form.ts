import { eq, inArray, type SQL, sql, type Column } from 'drizzle-orm';
import { UserFormTable, type UserFormTableInsert } from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';
import { SearchParams } from '$lib/enums/search-params';

export const Service = provider.getFactory().getService(UserFormTable);

export const getUrlFilters = (url: URL): WhereCondition<typeof UserFormTable>[] => {
	const baseUrlFilters = getUrlFiltersUtil(url, { searchColumns: [] });
	const serviceUrlFilters = getServiveUrlFilters(url);
	return [...baseUrlFilters, ...serviceUrlFilters];
};

type UserFormFilters = BodyFiltersUtil & {
	userIds?: string[];
	templateIds?: string[];
};
const bodyFiltersConfigurations: Record<keyof UserFormFilters, Column> = {
	ids: UserFormTable.id,
	userIds: UserFormTable.user_id,
	templateIds: UserFormTable.template_id
};
export const getBodyFilters = (
	filters: UserFormFilters
): WhereCondition<typeof UserFormTable>[] => {
	const baseBodyFilters = getBodyFiltersUtil(filters, bodyFiltersConfigurations);
	const serviceFilters = getServiceSpecificBodyFilters(filters, bodyFiltersConfigurations);
	const bodyFilters: WhereCondition<typeof UserFormTable>[] = [
		...baseBodyFilters,
		...serviceFilters
	];
	return bodyFilters;
};

const getServiceSpecificBodyFilters = (
	filters: UserFormFilters,
	configuration: Record<keyof UserFormFilters, Column>
): WhereCondition<typeof UserFormTable>[] => {
	const conditions: WhereCondition<typeof UserFormTable>[] = [];
	for (const key of Object.keys(filters)) {
		const typedKey = key as keyof BodyFiltersUtil;
		const value = filters[typedKey];
		const column = configuration[typedKey];
		if (!column) continue;
		switch (key) {
			case 'templateIds':
			case 'userIds': {
				conditions.push(inArray(column, value));
			}
		}
	}
	return conditions;
};

const getServiveUrlFilters = (url: URL): WhereCondition<typeof UserFormTable>[] => {
	const searchParams = url.searchParams;
	const pli = searchParams.get(SearchParams.PublicLinkIdentifier);
	const uid = searchParams.get(SearchParams.UserId);
	const conditions: WhereCondition<typeof UserFormTable>[] = [];
	if (pli) {
		conditions.push(eq(UserFormTable.public_link_identifier, pli));
	}
	if (uid) {
		conditions.push(eq(UserFormTable.user_id, uid));
	}
	return conditions;
};

export const getUrlOptions = (url: URL) => {
	return getUrlOptionsUtil(url, UserFormTable);
};

type NewUserForm = Pick<
	UserFormTableInsert,
	'user_id' | 'template_id' | 'data' | 'name' | 'description' | 'submissions'
>;
export const buildCreateCandidates = (candidates: NewUserForm[]): NewUserForm[] => {
	const newUsers: NewUserForm[] = [];
	candidates.forEach((candidate) => {
		newUsers.push({
			user_id: candidate.user_id,
			template_id: candidate.template_id,
			data: candidate.data,
			name: candidate.name,
			description: candidate.description,
			submissions: 0
		});
	});
	return newUsers;
};

type UpdateUserFormData = Partial<
	Pick<UserFormTableInsert, 'data' | 'description' | 'name'> & { submissions?: SQL }
>;
export const buildUpdateData = (updateData: UpdateUserFormData): UpdateUserFormData => {
	const validatedUpdate: UpdateUserFormData = {};
	if (updateData?.submissions) {
		validatedUpdate.submissions = sql`${UserFormTable.submissions} + 1`;
	}
	if (updateData?.data) {
		validatedUpdate.data = updateData.data;
	}
	if (updateData?.description) {
		validatedUpdate.description = updateData.description;
	}
	if (updateData?.name) {
		validatedUpdate.name = updateData.name;
	}
	return validatedUpdate;
};
