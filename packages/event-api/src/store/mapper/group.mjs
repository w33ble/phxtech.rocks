import { schema, relations } from '../schema/group.mjs';

export default store => {
  store.defineMapper('group', {
    table: 'groups',
    schema,
    relations,
  });
};
