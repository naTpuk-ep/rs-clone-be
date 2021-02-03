
import { ItemType } from '../types/item';
import { knex } from '../db/pg';


const tableName = 'todoist';

const listAll = async (userId: string) => {
	if (!userId) {
		throw new Error('User id must be provided')
	}
	return knex(tableName)
		.select()
		.where({ userId })
}

const getById = async (userId: string, id: string) => {
	if (!userId) {
		throw new Error('User id must be provided')
	}
	const list = await knex(tableName)
		.select()
		.where({ id, userId });

	return list[0];
}

const create = async (userId: string, item: ItemType) => {
	if (!userId) {
		throw new Error('User id must be provided')
	}
	const {id, title, completed, date} = item;
	const list = await knex(tableName)
		.insert({id, title, completed, userId, date})
		.returning("*");

	return list[0];
}
const update = async (userId: string, item: ItemType) => {
	const {id, title, completed, date} = item;
	const list = await knex(tableName)
		.update({id, title, completed, date})
		.where({ id, userId })
		.returning("*");

	return list[0];
}
const remove = async (userId: string, id: string) => {
	if (!userId) {
		throw new Error('User id must be provided')
	}
	if (!id) return;
	await knex(tableName)
		.delete()
		.where({ id, userId });
}


export {
	listAll,
	getById,
	create,
	update,
	remove
}