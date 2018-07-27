import jsData from 'js-data';

export default new jsData.Schema({
  title: 'Event',
  type: 'object',
  required: ['name', 'location', 'date', 'start_time'],
  properties: {
    id: { type: 'string', minLength: 14, maxLength: 14 },
    owner_id: { type: ['string', 'null'], minLength: 0, maxLength: 14 },
    group_id: { type: 'string', minLength: 0, maxLength: 14 },
    name: { type: 'string' },
    date: { type: 'string', format: 'date' },
    start_time: { type: 'string', format: 'time' },
    end_time: { type: 'string', format: 'time' },
    location: { type: 'string', maxLength: 255 },
    address: { type: ['string', 'null'], maxLength: 1024 },
    description: { type: 'string' },
    website: { type: 'string', format: 'url' },
    status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
    created_at: { type: 'string', format: 'datetime' },
    updated_at: { type: 'string', format: 'datetime' },
  },
});
