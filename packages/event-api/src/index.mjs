import User from './models/user.mjs';
import Group from './models/group.mjs';
import Event from './models/event.mjs';
import knex from './lib/knex.mjs';

async function eventApiServer() {
  // await createRecords();
  // return;

  const res = await queryWithJoin();
  console.log('--- queryWithJoin', res);

  const res5 = await queryWithReverseJoin();
  console.log('--- queryWithReverseJoin', res5);

  const res2 = await queryWithManyJoin();
  console.log('--- queryWithManyJoin', res2);

  const res4 = await queryUserWithJoin();
  console.log('--- queryUserWithJoin', res4);

  const res3 = await User.query().columnInfo();
  console.log('--- User columns', res3);

  // const res5 = await User.queryById('4javjeb88780xk').first()
  await User.query().where({ id: '4jg3hc19b8u0eo' }).update({
    email: 'joe@email.co'
  })
  const res6 = await User.queryById('4jg3hc19b8u0eo').first();
  console.log('Updated:', res6)
}

async function queryUserWithJoin() {
  return User.queryWith(['groups', 'events']).select()
  .columns('groups.id as group_id', 'events.id as event_id', 'users.*');
}

async function queryWithJoin() {
  return Group.queryWith('users')
    .first()
    .columns('groups.*', 'users.email as user_email')
    .where({ user_email: 'joe@email.co' });
}


async function queryWithReverseJoin() {
  return User.queryWith('groups')
    .first()
    .columns('users.*', 'groups.name as group_name')
    .where({ email: 'joe@email.co' });
}


async function queryWithManyJoin() {
  return Event.queryWith(['users'])
    .select()
    .column('events.name as event_name', 'users.email as user_email', 'events_users.*');
}

async function createRecords() {
  // insert user
  const user = await new User({
    name: 'Joe Fleming',
    email: 'joe@email.co',
  }).save();

  console.log('user:', user.id);

  // insert group
  const group = await new Group({
    user_id: user.id,
    name: 'PHX Android',
    description: `This is a group for anyone interested in Android Development, Design and development of Android Applications. All skill levels are welcome. I started this group to help grow the Android Google Developer Group community and to meet other people interested in Android Development. Come to the meet up to hang out and watch or be part of the conversation. Bring a project you're working on. Anything Android Development is welcome (dev, design, how to market your app, etc).`,
  }).save();

  console.log('group:', group.id);

  // insert event
  const event = await new Event({
    group_id: group.id,
    owner_id: user.id,
    datetime: new Date('2018-05-02T03:00Z').toISOString(),
    name: 'TensorFlow DevSummit Extension',
    description: `What is TensorFlow DevSummit?

  TensorFlow Dev Summit brings together a diverse mix of machine learning users from around the world for a full day of highly technical talks, demos, and conversation with the TensorFlow team and community.

  The TensorFlow DevSummit happened in Mountain View on March 30. This "extended" event is to go over what was announced and review how machine learning is changing how we write code in the years to come.

  Speakers:

  James Clohessy

  James attended the Tensoflow Devsummit and will talk about that a bit but he is also using Tensorflow now.

  Erik Wilson

  All about Tensorflow.js

  Mike Wolfson

  Intro to AI

  Always a good idea to bring your laptop. There will be food and drinks as usual . . . hope to see you there!`,
    location: 'Galvanize',
    address: '515 East Grant Street, Phoenix, AZ',
  }).save();

  console.log('event', event.id);

  // create join record
  await knex('events_users').insert({
    user_id: user.id,
    event_id: event.id,
  });

  // get group by id
  const result = await Group.queryById(group.id).first();
  console.log(result);
}

export default eventApiServer()
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
