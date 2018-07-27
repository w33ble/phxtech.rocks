import jsData from 'js-data';

export default new jsData.Schema({
  title: 'Group',
  type: 'object',
  required: ['name', 'event_type', 'status'],
  properties: {
    id: { type: 'string', minLength: 14, maxLength: 14 },
    owner_id: { type: ['string', 'null'], minLength: 14, maxLength: 14 },
    name: { type: 'string' },
    description: { type: 'string' },
    website: { type: ['string', 'null'], format: 'url' },
    event_type: { type: 'string', enum: ['meetup', 'ical'] },
    event_url: { type: 'string' },
    status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
    created_at: { type: 'string', format: 'datetime' },
    updated_at: { type: 'string', format: 'datetime' },
  },
});
