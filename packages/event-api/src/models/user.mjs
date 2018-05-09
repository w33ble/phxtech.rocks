import BaseModel from './base.mjs';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        id: { type: 'string', minLength: 14, maxLength: 14 },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
      },
    };
  }

  static get relationships() {
    return {
      groups: {
        model: 'Group',
        relation: BaseModel.hasMany,
        joinType: 'left',
        remote: 'user_id',
        // local: 'id', // implied
      },
      events: {
        model: 'Event',
        relation: BaseModel.belongsToMany,
        // joinType: 'inner', // implied
        // remote: 'id', // implied
        // local: 'id', // implied
        joinLocal: 'user_id',
        joinRemote: 'event_id',
        joinTable: 'events_users',
      },
    };
  }
}

User.register();

export default User;
