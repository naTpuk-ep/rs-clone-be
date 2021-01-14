require('dotenv').config();
import { MongoClient } from 'mongodb';
import ItemType from '../types/item';

const dbName = 'rs-clone-todoist';

const {MONGO_PASSWORD, MONGO_USERNAME, MONGO_HOST} = process.env;


const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/?retryWrites=true&w=majority`;
// const url = `mongodb+srv://naTpuk:123qwe@/cluster0.c783f.mongodb.net?retryWrites=true&w=majority`;

const collectionName = 'todos';

const getMongoInstance = async () => {
	const client = await MongoClient.connect(url, { useUnifiedTopology: true });
	return client.db(dbName);
}

const getCollection = async () => {
	const db = await getMongoInstance();
	return db.collection(collectionName);
}

const listAll = async () => {
	const collection = await getCollection();
	return collection.find({}).toArray();
}
const getById = async (id: string) => {
	const collection = await getCollection();
	return await collection.findOne({ id });
}
const create = async (item: ItemType) => {
	const collection = await getCollection();
	const res = await collection.insertOne(item);
	return res.ops[0];
}
const update = async (item: ItemType) => {
	const collection = await getCollection();
	const id = item.id;
	const res = await collection.replaceOne({id}, item);
	return res.ops[0];
}
const remove = async (id: string) => {
	const collection = await getCollection();
	return collection.deleteOne({id});
}



export {
	listAll,
	getById,
	create,
	update,
	remove
}