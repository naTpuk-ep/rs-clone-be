import { sessionTable } from '../constants';
import { knex } from '../db/pg';

export const getSessionByToken = async (token: string) => {
	if (!token) {
		throw new Error('No token has provided')
	}
	const [session] = await knex(sessionTable)
		.select()
		.where({ token })

	const result = session && new Date(session.expiresAt).getTime() > Date.now()
		? session : null;
	return result;
}