import Puid from 'puid';
import Ajv from 'ajv';
import knex from '../libs/knex.mjs';

const puid = new Puid(false);
const ajv = new Ajv();
// const modelRegistery = new Map(); // TODO: mapping relationships

function validateModel(child) {
  function showError(msg) {
    throw new Error(`Model failure, ${msg}: ${child.name}`);
  }

  if (!child.tableName) showError('`tableName` is required');
}

export default class BaseModel {
  constructor(doc = {}) {
    validateModel(this.constructor);
    // modelRegistery.set(this.constructor.name, this.constructor); // TODO: mapping relationships

    this.doc = doc;
    this.doc[this.primaryKey] = this.doc[this.primaryKey] || puid.generate();
  }

  get primaryKey() {
    return this.constructor.primaryKey || 'id';
  }

  async save() {
    const schema = this.constructor.jsonSchema;

    if (schema) {
      const validate = ajv.compile(schema);
      const valid = validate(this.doc);
      if (!valid) {
        // console.error(validate.errors); // TODO: proper error logger
        throw new Error(
          `document '${validate.errors[0].dataPath.replace(/^\./, '')}' ${
            validate.errors[0].message
          }`
        );
      }
    }

    await knex(this.constructor.tableName).insert(this.doc);

    return knex(this.constructor.tableName)
      .where({ [this.primaryKey]: this.doc[this.primaryKey] })
      .first();
  }

  static get primaryKey() {
    return 'id';
  }

  static query() {
    return knex(this.tableName);
  }

  static async byId(id) {
    return this.query()
      .where({ [this.primaryKey]: id })
      .first();
  }
}
