import User from './models/user.mjs';
import Group from './models/group.mjs';
import Event from './models/event.mjs';

async function eventApiServer() {
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

  // get group by id
  const result = await Group.byId(group.id);
  console.log(result);
}

export default eventApiServer()
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
