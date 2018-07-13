import store from './store.mjs';

async function eventApiServer() {
  console.log('server: hello world');
  const ev = await store.find('event', '4kob5fvmaby0m0');
  console.log('event:', ev.name);
  const group = await store.find('group', ev.group_id);
  console.log('group:', group.name);
}

export default eventApiServer()
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
