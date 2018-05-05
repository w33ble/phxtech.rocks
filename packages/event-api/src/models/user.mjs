import BaseModel from './base.mjs';

export default class User extends BaseModel {
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
}
