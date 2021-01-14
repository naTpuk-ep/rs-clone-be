import * as initEnv from 'dotenv';
initEnv.config();
import * as knexInit from 'knex';
import ItemType from '../types/item';


const {PG_PASSWORD, PG_USERNAME, PG_HOST, PG_DBNAME} = process.env;

const url = process.env.DATABASE_URL
	?? `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}/${PG_DBNAME}`;

const dbName = PG_DBNAME;
const tableName = 'todoist';

const knex = knexInit({
  client: 'pg',
	connection: url,
	debug: true,
});

const listAll = async () => {
	return knex(tableName)
		.select();
}
const getById = async (id: string) => {
	const list = await knex(tableName)
		.select()
		.where({ id });

	return list[0];
}
const create = async (item: ItemType) => {
	const {id, data} = item;
	const list = await knex(tableName)
		.insert({id, data})
		.returning("*");

	return list[0];
}
const update = async (item: ItemType) => {
	const {id, data} = item;
	const list = await knex(tableName)
		.update({id, data})
		.where({ id })
		.returning("*");

	return list[0];
}
const remove = async (id: string) => {
	if (!id) return;

	await knex(tableName)
		.delete()
		.where({ id });
}


export {
	listAll,
	getById,
	create,
	update,
	remove
}