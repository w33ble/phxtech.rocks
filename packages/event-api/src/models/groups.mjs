export default {
  name: 'groups',
  // primary_key: 'id', // implied
  schema: {
    id: { type: 'increments' },
    name: { type: 'string' }, // not nullable implied
    description: { type: 'text' },
    event_type: { type: 'enum', values: ['meetup', 'ical'], default: 'meetup' },
    website: { type: 'string', nullable: true },
  },
  // timestamps: true, // implied
};
