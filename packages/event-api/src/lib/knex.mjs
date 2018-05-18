import knex from 'knex';
import dbConfig from '../config/db.mjs';

const db = knex(dbConfig);

export default db;
