import BaseModel from './base.mjs';

class Event extends BaseModel {
  static get tableName() {
    return 'events';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'owner_id', 'group_id', 'location', 'datetime'],
      properties: {
        id: { type: 'string', minLength: 14, maxLength: 14 },
        owner_id: { type: 'string', minLength: 14, maxLength: 14 },
        group_id: { type: 'string', minLength: 14, maxLength: 14 },
        name: { type: 'string' },
        datetime: { type: 'string', format: 'date-time' },
        location: { type: 'string', maxLength: 255 },
        address: { type: 'string', maxLength: 1024 },
        description: { type: 'string' },
        website: { type: 'string', format: 'url' },
        status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
      },
    };
  }

  static get relationships() {
    return {
      groups: {
        model: 'Group',
        relation: BaseModel.belongsTo,
        remote: 'event_id',
      },
      users: {
        model: 'User',
        relation: BaseModel.belongsToMany,
        // joinType: 'inner', // implied
        // remote: 'id', // implied
        // local: 'id', // implied
        joinLocal: 'event_id',
        joinRemote: 'user_id',
        joinTable: 'events_users',
      },
    };
  }
}

Event.register();

export default Event;
