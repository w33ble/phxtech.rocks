import groups from './groups.mjs';

function getColumn(table, field, def) {
  if (def.type === 'string' || def.type === 'varchar' || def.type === 'char')
    return table[def.type](field, def.length || 255);

  if (def.type === 'text') {
    const validTypes = ['mediumtext', 'longtext', 'text'];
    return table.text(field, validTypes.includes(def.text_type) ? def.text_type : 'text');
  }

  if (def.type === 'float' || def.type === 'double' || def.type === 'decimal')
    return table[def.type](field, def.precision, def.scale);

  if (def.type === 'timestamp' || def.type === 'timestamptz')
    return table.timestamp(field, def.type !== 'timestamptz');

  if (def.type === 'enu' || def.type === 'enum') {
    if (!Array.isArray(def.values)) throw new Error('enum fields require a value array');
    return table.enu(field, def.values);
  }

  return table[def.type](field);
}

async function createTable(db, { name, schema, timestamps, primaryKey = 'id' } = {}) {
  if (!schema[primaryKey])
    throw new Error(`Invalid primary key defined for schema ${name}, ${primaryKey}`);

  const exists = await db.schema.hasTable(name);

  if (exists) return exists;

  return db.schema.createTable(name, t => {
    t.unique(primaryKey);
    if (timestamps !== false) t.timestamps(true, true);

    Object.keys(schema).forEach(field => {
      const def = schema[field];
      const column = getColumn(t, field, def);

      if (field === primaryKey) column.notNullable();
      if (def.unsigned) column.unsigned();
      if (def.default) column.defaultTo(def.default);
      if (def.unique) column.unique();
      if (def.unsigned) column.unsigned();
      if (def.nullable === false) column.notNullable();
    });
  });
}

export default function initModels(db) {
  return Promise.all([createTable(db, groups)]);
}
