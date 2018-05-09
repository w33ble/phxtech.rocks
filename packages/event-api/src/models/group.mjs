import BaseModel from './base.mjs';

class Group extends BaseModel {
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

  static get relationships() {
    return {
      users: {
        model: 'User',
        relation: BaseModel.belongsTo,
        local: 'user_id',
        // remote: 'id', // implied
      },
    };
  }
}

Group.register();

export default Group;
