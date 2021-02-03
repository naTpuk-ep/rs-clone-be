import { Router } from 'express';
import { knex } from '../db/pg';
import { v4 as uuid } from 'uuid';
// import * as initEnv from 'dotenv';
// initEnv.config();
import * as md5 from 'md5';
import { Usertable, sessionTable } from '../constants';
import { auth } from '../middleware/auth';

const { PG_SALT } = process.env;

const router = Router();

const getPasswordHash = (pass: string) => {
	return md5(pass + PG_SALT);
}

const generateToken = () => {
	return uuid();
}

router.post('/login', async (req, res, next) => {
	const {body: { username, password }} = req;

	const passwordHash = getPasswordHash(password);
	
	const [user] = await knex(Usertable)
		.select()
		.where({username, passwordHash})

	const statusCode = user ? 200 : 403;
	const token = user ? generateToken() : undefined;
	const reason = user ? undefined : 'Invalid user name or password';

	if (token) {
		await knex(sessionTable).insert({
			token,
			userId: user.id,
			expiresAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
		});
	}

  const response = {
		statusCode,
		token,
		reason,
	};
	res.json(response);
});

router.post('/register', async (req, res, next) => {
	const {body: { username, password }} = req;
	
	const [user] = await knex(Usertable)
		.select()
		.where({username})

	if (user) {
		res.json({
			statusCode: 404,
			reason: `${username} already exist`
		});
		return;
	}

	if (!password || password.length < 6) {
		res.json({
			statusCode: 404,
			reason: `Password can not be less then 6`
		});
		return;
	}

	const passwordHash = getPasswordHash(password);
	const id = uuid();

	await knex(Usertable)
		.insert({username, passwordHash, id})


	const statusCode = 200;
	const token = generateToken();

	if (token) {
		await knex(sessionTable).insert({
			token,
			userId: id,
			expiresAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
		});
	}

  const response = {
		statusCode,
		token,
	};
	res.json(response);
});

router.post('/test', auth, async (req, res, next) => {
	res.status(200).json({
		statusCode: 200
	})
});

export default router;