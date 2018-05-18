import BaseModel from 'simple-knex-model';
import Puid from 'puid';
import knex from '../lib/knex.mjs';

const puid = new Puid(false);

class CustomModel extends BaseModel {
  static onCreate(doc) {
    // eslint-disable-next-line no-param-reassign
    doc[this.primaryKey] = doc[this.primaryKey] || puid.generate();
  }
}

CustomModel.knex(knex);

export default CustomModel;
