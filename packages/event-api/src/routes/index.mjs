import Group from '../models/group.mjs';
import Event from '../models/event.mjs';
import modelRoute from '../libs/model_route.mjs';

export default function createRoutes(app) {
  app.use('/api', modelRoute(Group));
  app.use('/api', modelRoute(Event));
}
