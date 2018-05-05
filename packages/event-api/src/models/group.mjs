import BaseModel from './base.mjs';

export default class Group extends BaseModel {
  static get tableName() {
    return 'groups';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'user_id'],
      properties: {
        id: { type: 'string', minLength: 14, maxLength: 14 },
        user_id: { type: 'string', minLength: 14, maxLength: 14 },
        name: { type: 'string' },
        description: { type: 'string' },
        event_type: { type: 'string', enum: ['meetup', 'ical'] },
        website: { type: ['string', 'null'], format: 'url' },
        status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
      },
    };
  }
}
