import { promises as fsp } from 'fs';
import { ItemType } from '../types/item';

const fileName = 'items.json';

const filePath = `${__dirname}/${fileName}`;

const readItemList = async (): Promise<ItemType[]> => {

	let list: ItemType[] = [];

	try {
		const contents = await fsp.readFile(filePath, 'utf-8');
		const parsedList = JSON.parse(contents);
		if (!Array.isArray(list)) {
			throw new TypeError();
		}
		list = parsedList;
	} catch (e: unknown) {
		if (!(e instanceof Error)) {
			throw e;
		}
		console.warn(`There was error: ${e.message}`);
	}

	return list;
}

const writeItemList = async (list: ItemType[]): Promise<ItemType[]> => {
	const stringifiedList = JSON.stringify(list);

	await fsp.writeFile(filePath, stringifiedList, 'utf-8');

	return list;
}


const listAll = async () => readItemList();

const getById = async (id: string): Promise<ItemType | undefined> => {
	const list = await readItemList();
	return list.find(v => v.id === id);
};

const create = async (item: ItemType) => {
	const list = await readItemList();
	list.push(item);
	await writeItemList(list);
	return item;
};

const update = async (item: ItemType) => {
	const list = await readItemList();
	const index = list.findIndex(v => v.id === item.id);
	if (index !== -1) {
		throw new Error();
	}
	list[index] = item;
	await writeItemList(list);
	return item;
};

const remove = async (id: string) => {
	const list = await readItemList();
	const index = list.findIndex(v => v.id === id);
	list.splice(index, 1);
	await writeItemList(list);
};

export {
	listAll,
	getById,
	create,
	update,
	remove
}