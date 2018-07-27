import store from './store.mjs';

async function eventApiServer() {
  // query both event and group separately
  console.log('-- multiple queries:');
  const ev = await store.find('event', '4kob5fvmaby0m0');
  console.log('event: %s (id: %s)', ev.name, ev.id);
  const group = await store.find('group', ev.group_id);
  console.log('group: %s (id: %s)', group.name, group.id);

  // query event with group attached
  console.log('-- single query:');
  const ev2 = await store.find('event', '4kob5fvmaby0m0', { with: ['group'] });
  console.log('event: %s (id: %s)', ev2.name, ev2.id);
  console.log('group: %s (id: %s)', ev2.group.name, ev2.group.id);
}

export default eventApiServer()
  .catch(err => {
    console.error(err);
  })
  .then(() => process.exit());
