const statuses = ['pending', 'approved', 'denied'];

exports.up = knex =>
  knex.schema
    .createTable('users', t => {
      t.string('id')
        .notNull()
        .unique()
        .primary();
      t.timestamps(true, true);
      t.string('name').notNull();
      t.string('email').notNull();
      t.enum('status', statuses)
        .defaultTo('pending')
        .notNullable();
    })
    .createTable('groups', t => {
      t.string('id')
        .notNull()
        .unique()
        .primary();
      t.string('owner_id').references('users.id');
      t.timestamps(true, true);
      t.string('name').notNull();
      t.text('description', 'text').nullable();
      t.enum('event_type', ['local', 'meetup', 'ical', 'other'])
        .notNull()
        .defaultTo('local');
      t.string('event_url').nullable();
      t.string('website').nullable();
      t.enum('status', statuses)
        .defaultTo('pending')
        .notNullable();
      t.index('owner_id');
    })
    .createTable('events', t => {
      t.string('id')
        .notNull()
        .unique()
        .primary();
      t.string('group_id').references('groups.id');
      t.string('owner_id').references('users.id');
      t.timestamps(true, true);
      t.string('name').notNull();
      t.date('date').notNull();
      t.time('start_time').notNull();
      t.time('end_time').nullable();
      t.string('location').notNull();
      t.text('address', 'text');
      t.text('description', 'text');
      t.string('website').nullable();
      t.enum('status', statuses)
        .defaultTo('pending')
        .notNullable();
      t.index('group_id');
      t.index('owner_id');
    })
    .createTable('events_users', t => {
      t.increments('id')
        .primary()
        .unique();
      t.string('user_id')
        .references('users.id')
        .notNullable();
      t.string('event_id')
        .references('events.id')
        .notNullable();
      t.index(['user_id', 'event_id']);
    })
    .createTable('groups_users', t => {
      t.increments('id')
        .primary()
        .unique();
      t.string('user_id')
        .references('users.id')
        .notNullable();
      t.string('group_id')
        .references('groups.id')
        .notNullable();
      t.index(['user_id', 'group_id']);
    });
exports.down = knex =>
  knex.schema
    .dropTable('users')
    .dropTable('groups')
    .dropTable('events')
    .dropTable('events_users')
    .dropTable('groups_users');
