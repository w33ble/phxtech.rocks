const statuses = ['pending', 'approved', 'denied'];

exports.up = knex =>
  knex.schema
    .createTable('users', t => {
      t
        .string('id')
        .notNull()
        .unique()
        .primary();
      t.timestamps(true, true);
      t.string('name').notNull();
      t.string('email').notNull();
      t.enum('status', statuses).defaultTo('pending').notNullable();
    })
    .createTable('groups', t => {
      t
        .string('id')
        .notNull()
        .unique()
        .primary();
      t.string('user_id').references('users.id');
      t.timestamps(true, true);
      t.string('name').notNull();
      t.text('description', 'text').nullable();
      t
        .enum('event_type', ['meetup', 'ical'])
        .notNull()
        .defaultTo('meetup');
      t.string('website').nullable();
      t.enum('status', statuses).defaultTo('pending').notNullable();
    })
    .createTable('events', t => {
      t
        .string('id')
        .notNull()
        .unique()
        .primary();
      t.string('group_id').references('groups.id');
      t.string('owner_id').references('users.id');
      t.timestamps(true, true);
      t.string('name').notNull();
      t.timestamp('datetime').notNull();
      t.string('location').notNull();
      t.text('address', 'text');
      t.text('description', 'text');
      t.string('website').nullable();
      t.enum('status', statuses).defaultTo('pending').notNullable();
    })
    .createTable('events_users', t => {
      t
        .increments('id')
        .primary()
        .unique();
      t.string('user_id').references('users.id').notNullable();
      t.string('event_id').references('events.id').notNullable();
    });

exports.down = knex =>
  knex.schema
    .dropTable('users')
    .dropTable('groups')
    .dropTable('events')
    .dropTable('events_users');
