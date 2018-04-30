/* eslint no-console: 0 */
import crypto from 'crypto';
import knex from 'knex';
import knexConfig from '../src/config/db.mjs';

const knexInstance = knex(knexConfig);

const commands = {
  make: 'Create a new migration',
  rollback: 'Roll back the latest migration',
  latest: 'Migrate to the latest version',
  retry: 'Rollback and retry a migration (useful for testing)',
  show: 'Show the current migration version',
};

const rand = len =>
  crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);

const showFiles = files => files.map(file => file.replace(process.cwd(), '')).join('\n');

function showHelp() {
  console.log(`
Knex migration script

  Usage: migrate ${process.argv.slice(2)} <cmd>\n`);

  Object.entries(commands).forEach(([key, value]) => {
    console.log(`    ${key} - ${value}`);
  });

  console.log('\n');
  process.exit(1);
}

(function migrateCmd() {
  const cmd = process.argv[2];

  if (!cmd || !commands[cmd]) showHelp();

  switch (cmd) {
    case 'make': {
      const name = process.argv[3] || rand(8);
      return knexInstance.migrate.make(name);
    }

    case 'show': {
      return knexInstance.migrate.currentVersion().then(ver => `Current version: ${ver}`);
    }

    case 'latest': {
      return knexInstance.migrate.latest().then(([, files]) => `Migrated:\n${showFiles(files)}`);
    }

    case 'rollback': {
      return knexInstance.migrate.rollback().then(([, files]) => `Rollback:\n${showFiles(files)}`);
    }

    case 'retry': {
      return knexInstance.migrate
        .rollback()
        .then(() => knexInstance.migrate.latest())
        .then(([, files]) => `Retry:\n${showFiles(files)}`);
    }

    default:
      throw new Error('wat!');
  }
})()
  .then(res => {
    console.log(res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
