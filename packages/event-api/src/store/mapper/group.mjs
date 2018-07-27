import groupSchema from '../schema/group.mjs';

export default store => {
  store.defineMapper('group', {
    table: 'groups',
    schema: groupSchema,
  });
};
