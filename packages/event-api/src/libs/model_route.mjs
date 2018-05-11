/* eslint no-console: 0 */
import express from 'express';
import { sendResponse, makeArray } from './utils.mjs';

/*
  options Object
    options.endpoint String base endpoint to use
    options.pluralEndpoint String base endpoint to use for plural routes
    options.use Function|[Function] middleware to execute before any other routes in endpoint
    options.maxListSize Number The maximum number of records to return from list route
    options.middleware Object middleware to use, keyed by route type (list, get, create, update, delete)
    options.routes Object handler for any of the default routes, overrides the default
  }
*/
export default function createModelRoute(Model, options = {}) {
  const router = express.Router();
  const endpoint = options.endpoint || `/${Model.name.toLocaleLowerCase()}`;
  const pluralEndpoint = options.pluralEndpoint || `/${Model.name.toLocaleLowerCase()}s`;
  const middleware = options.middleware || {};
  const routes = options.routes || {};

  if (options.use) {
    makeArray(options.use).forEach(use => router.use(endpoint, use));
  }

  const applyMiddleware = (type, path, method = 'all') => {
    if (middleware[type]) makeArray(middleware[type]).forEach(m => router[method](path, m));
  };

  const confirmExists = async (req, res, next) => {
    try {
      const row = await Model.queryById(req.params.id).first();

      if (!row) {
        sendResponse(res, 'NOT_FOUND');
      } else {
        req.document = row;
        next();
      }
    } catch (err) {
      // TODO: real error logging
      console.error(err);
      sendResponse(res, 'SERVER_ERROR');
    }
  };

  // LIST
  applyMiddleware('list', pluralEndpoint);
  if (routes.list) {
    router.get(pluralEndpoint, routes.list);
  } else {
    router.get(pluralEndpoint, async (req, res) => {
      const page = req.query.page || 0;
      const count = Math.min(req.query.count || 20, options.maxListSize || 100);
      const filter = req.user.isAdmin ? {} : { status: 'approved' };
      try {
        const rows = await Model.query()
          .where(filter)
          .orderBy('name')
          .limit(count)
          .offset(page * count);
        sendResponse(res, null, rows);
      } catch (err) {
        // TODO: real error logging
        console.error(err);
        sendResponse(res, 'SERVER_ERROR');
        // res.status(400).end({ message: err.message });
      }
    });
  }

  // READ
  applyMiddleware('read', `${endpoint}/:id`);
  if (routes.read) {
    router.get(`${endpoint}/:id`, confirmExists, routes.read);
  } else {
    router.get(`${endpoint}/:id`, confirmExists, (req, res) => {
      if (!req.user.isAdmin && !req.document.status.approved) {
        sendResponse(res, 'NOT_FOUND');
      }

      sendResponse(res, null, req.document);
    });
  }

  // CREATE
  applyMiddleware('create', endpoint);
  if (routes.create) {
    router.post(endpoint, routes.create);
  } else {
    router.post(endpoint, (req, res) =>
      new Model(req.body)
        .save()
        .then(row => sendResponse(res, null, row))
        .catch(err => {
          // TODO: real error logging
          console.error(err);
          sendResponse(res, 'BAD_REQUEST');
          // res.status(400).end({ message: err.message });
        })
    );
  }

  // UPDATE
  applyMiddleware('update', `${endpoint}/:id`);
  if (routes.update) {
    router.put(`${endpoint}/:id`, confirmExists, routes.update);
  } else {
    router.put(`${endpoint}/:id`, confirmExists, async (req, res) => {
      try {
        // update document by id
        const row = await Model.queryById(req.params.id).first();
        const { valid, errors } = Model.validate({ ...row, ...req.body });
        if (!valid) {
          // TODO: real error logging
          console.error(errors);
          return sendResponse(res, 'BAD_REQUEST');
        }

        // fetch and return updated document
        const updated = await Model.queryById(req.params.id).first();
        return sendResponse(res, null, updated);
      } catch (err) {
        // TODO: real error logging
        console.error(err);
        return sendResponse(res, 'SERVER_ERROR');
        // res.status(500).end();
      }
    });
  }

  // DELETE
  applyMiddleware('delete', `${endpoint}/:id`);
  if (routes.delete) {
    router.delete(`${endpoint}/:id`, confirmExists, routes.delete);
  } else {
    router.delete(`${endpoint}/:id`, confirmExists, (req, res) =>
      Model.queryById(req.params.id)
        .del()
        .then(() => sendResponse(res, null))
        .catch(err => {
          // TODO: real error logging
          console.error(err);
          // res.status(500).end();
          sendResponse(res, 'SERVER_ERROR');
        })
    );
  }

  return router;
}
