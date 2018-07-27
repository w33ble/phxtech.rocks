import eventSchema from '../schema/event.mjs';

export default store => {
  store.defineMapper('event', {
    table: 'events',
    scehma: eventSchema,
  });
};
