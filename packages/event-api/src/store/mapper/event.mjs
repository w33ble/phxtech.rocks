import { schema, relations } from '../schema/event.mjs';

export default store => {
  store.defineMapper('event', {
    table: 'events',
    schema,
    relations,
  });
};
