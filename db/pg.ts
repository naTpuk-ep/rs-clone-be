import * as knexInit from 'knex';
import * as initEnv from 'dotenv';
initEnv.config();

const {PG_PASSWORD, PG_USERNAME, PG_HOST, PG_DBNAME} = process.env;

const url = process.env.DATABASE_URL
	?? `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}/${PG_DBNAME}`;

const knex = knexInit({
  client: 'pg',
	connection: url,
	debug: true,
});

export {knex};