import store from './store.mjs';

async function eventApiServer() {
  const ev = await store.find('event', '4kob5fvmaby0m0');
  console.log('event: %s (id: %s)', ev.name, ev.id);
  const group = await store.find('group', ev.group_id);
  console.log('group: %s (id: %s)', group.name, group.id);
}

export default eventApiServer()
  .catch(err => {
    console.error(err);
  })
  .then(() => process.exit());
