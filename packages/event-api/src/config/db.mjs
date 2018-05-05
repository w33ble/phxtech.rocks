export default {
  client: 'sqlite3',
  connection: {
    filename: 'data/api.sqlite3',
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'migrations',
  },
};