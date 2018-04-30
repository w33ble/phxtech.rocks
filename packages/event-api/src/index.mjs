import knex from 'knex';
import Puid from 'puid';
import initModels from './models/index.mjs';

const puid = new Puid(true);

const db = knex({
  dialect: 'sqlite3',
  connection: {
    filename: 'data/api.db',
  },
  useNullAsDefault: true,
});

async function eventApiServer() {
  try {
    await initModels(db);
    const doc = {
      id: puid.generate(),
      name: 'PHX Android',
      description: `This is a group for anyone interested in Android Development, Design and development of Android Applications. All skill levels are welcome. I started this group to help grow the Android Google Developer Group community and to meet other people interested in Android Development. Come to the meet up to hang out and watch or be part of the conversation. Bring a project you're working on. Anything Android Development is welcome (dev, design, how to market your app, etc).`,
    };
    const resp = await db('groups').insert(doc);
    console.log('new groupi %s (%s)', doc.name, resp[0]);
  } catch (err) {
    console.error(err);
  }

  return 'done';
}

export default eventApiServer();
