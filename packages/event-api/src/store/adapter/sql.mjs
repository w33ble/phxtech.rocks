import sql from 'js-data-sql';
import db from '../../config/db.mjs';

const adapter = new sql.SqlAdapter({
  knexOpts: db,
});

export default adapter;
