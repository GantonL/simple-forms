import type { PageServerLoad } from './$types';
import { Demo } from '../../../api';
import { GET } from '$lib/api/helpers/request';
import type { User } from '$lib/server/database/schemas/demo_users';

const usersUrl = `${Demo}/users`;
const countUsersUrl = `${Demo}/count/users`;
export const load: PageServerLoad = async ({ fetch }) => {
	let users: User[] = [];
	let total = 0;
	try {
		const limit = 10;
		const orderBy = '-createdAt';
		users = await GET<User[]>(usersUrl, { fetch, limit, orderBy });
		total = await GET<number>(countUsersUrl, { fetch });
		return { users, total, dbAvailable: true };
	} catch {
		return { users, total, dbAvailable: false };
	}
};
