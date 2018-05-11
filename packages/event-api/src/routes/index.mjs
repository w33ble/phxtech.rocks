import Group from '../models/group.mjs';
import Event from '../models/event.mjs';
import modelRoute from '../libs/model_route.mjs';
import { sendResponse } from '../libs/utils.mjs';

const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) return next();
  return sendResponse(res, 'FORBIDDEN');
};

export default function createRoutes(app) {
  const authMiddleware = {
    create: [isAdmin],
    update: [isAdmin],
    delete: [isAdmin],
  };

  // groups
  app.use(
    '/api',
    modelRoute(Group, {
      middleware: authMiddleware,
    })
  );

  // events
  app.use(
    '/api',
    modelRoute(Event, {
      middleware: authMiddleware,
      routes: {
        list: async (req, res) => {
          const days = Math.min(req.query.days || 31, 70);
          const start = req.query.start ? new Date(Number(req.query.start)) : new Date();
          const end = new Date(start);
          end.setDate(start.getDate() + days);

          if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
            // TODO: real error logging
            console.error('invalid dates', { start: start.valueOf(), end: end.valueOf() });
            return sendResponse(res, 'BAD_REQUEST');
          }

          const filter = req.user.isAdmin ? {} : { status: 'approved' };

          const rows = await Event.query()
            .whereBetween('datetime', [start.toISOString(), end.toISOString()])
            .andWhere(filter)
            .orderBy('datetime');
          return sendResponse(res, null, rows);
        },
      },
    })
  );
}
