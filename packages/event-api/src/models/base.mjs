import BaseModel from 'simple-knex-model';
import Puid from 'puid';
import knex from '../libs/knex.mjs';

BaseModel.knex(knex);

const puid = new Puid(false);

class CustomModel extends BaseModel {
  static onCreate(doc) {
    doc[this.primaryKey] = doc[this.primaryKey] || puid.generate();
  }
}

export default CustomModel;
