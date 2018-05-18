import BaseModel from './base.mjs';

class Group extends BaseModel {
  static get tableName() {
    return 'groups';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'string', minLength: 14, maxLength: 14 },
        owner_id: { type: 'string', minLength: 14, maxLength: 14 },
        name: { type: 'string' },
        description: { type: 'string' },
        website: { type: ['string', 'null'], format: 'url' },
        event_type: { type: 'string', enum: ['meetup', 'ical'] },
        event_url: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
      },
    };
  }

  static get relationships() {
    return {
      owner: {
        model: 'User',
        relation: BaseModel.belongsTo,
        // local: 'user_id',
        // remote: 'id', // implied
      },
      members: {
        model: 'User',
        relation: BaseModel.belongsToMany,
      },
      events: {
        model: 'Event',
        relation: BaseModel.hasMany,
      },
    };
  }
}

Group.register();

export default Group;
