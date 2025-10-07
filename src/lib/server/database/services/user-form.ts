import { eq, inArray, type Column } from 'drizzle-orm';
import { UserFormTable, type UserFormTableInsert } from '../schemas/form';
import type { WhereCondition } from './abstract';
import { provider } from './provider';
import {
	getBodyFiltersUtil,
	getUrlFiltersUtil,
	getUrlOptionsUtil,
	type BodyFiltersUtil
} from './utils';

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
	const pli = searchParams.get('pli');
	const conditions: WhereCondition<typeof UserFormTable>[] = [];
	if (pli) {
		conditions.push(eq(UserFormTable.public_link_identifier, pli));
	}
	return conditions;
};

export const getUrlOptions = (url: URL) => {
	return getUrlOptionsUtil(url, UserFormTable);
};

type NewUserForm = Pick<UserFormTableInsert, 'user_id' | 'template_id'>;
export const buildCreateCandidates = (candidates: NewUserForm[]): NewUserForm[] => {
	const newUsers: NewUserForm[] = [];
	candidates.forEach((candidate) => {
		newUsers.push({
			user_id: candidate.user_id,
			template_id: candidate.template_id
		});
	});
	return newUsers;
};

type UpdateUserFormData = Pick<UserFormTableInsert, 'submissions'>;
export const buildUpdateData = (updateData: UpdateUserFormData): UpdateUserFormData => {
	const validatedUpdate: UpdateUserFormData = {};
	if (updateData?.submissions) {
		validatedUpdate.submissions = updateData.submissions;
	}
	return validatedUpdate;
};
