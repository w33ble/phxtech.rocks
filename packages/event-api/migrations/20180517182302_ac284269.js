exports.up = knex =>
  knex.schema
    .table('groups', t => {
      t.renameColumn('user_id', 'owner_id');
      t.dropColumn('event_type');
    })
    .table('groups', t => {
      t.index('owner_id');
      t
        .enum('event_type', ['local', 'meetup', 'ical', 'other'])
        .notNull()
        .defaultTo('local');
      t.string('event_url').nullable();
    })
    .table('events', t => {
      t.index('group_id');
      t.index('owner_id');
    })
    .table('events_users', t => {
      t.index(['user_id', 'event_id']);
    })
    .createTable('groups_users', t => {
      t
        .increments('id')
        .primary()
        .unique();
      t
        .string('user_id')
        .references('users.id')
        .notNullable();
      t
        .string('group_id')
        .references('groups.id')
        .notNullable();
    })
    .table('groups_users', t => {
      t.index(['user_id', 'group_id']);
    });

exports.down = knex =>
  knex.schema
    .table('groups', t => {
      t.renameColumn('owner_id', 'user_id');
      t.dropColumn('event_type');
      t.dropColumn('event_url');
    })
    .table('groups', t => {
      t
        .enum('event_type', ['meetup', 'ical'])
        .notNull()
        .defaultTo('meetup');
    })
    .table('events', t => {
      t.dropIndex('group_id');
      t.dropIndex('owner_id');
    })
    .table('events_users', t => {
      t.dropIndex(['user_id', 'event_id']);
    })
    .dropTable('groups_users');
