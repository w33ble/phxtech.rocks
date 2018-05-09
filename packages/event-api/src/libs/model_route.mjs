/* eslint no-console: 0 */
import express from 'express';

const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

function sendResponse(res, err, data = {}) {
  if (res == null) {
    throw new Error('`sendResponse()` Arguments invalid.');
  }

  let statusCode = 200;
  const headers = {
    'content-type': 'application/json; charset=utf-8',
  };

  const response = { data };

  if (err) {
    response.errors = (Array.isArray(err) ? err : [err]).map(error => {
      if (typeof error === 'string') {
        statusCode = errorCodes[error] || 500;
        return { message: error };
      }

      if (error instanceof Error) {
        statusCode = errorCodes[error.message] || 500;
        return { message: error.message };
      }

      statusCode = 500;
      return { message: 'unknown error' };
    });
  }

  return res
    .set(headers)
    .status(statusCode)
    .end(JSON.stringify(response));
}

export default function createModelRoute(Model, options = {}) {
  const router = express.Router();
  const endpoint = options.endpoint || `/${Model.name.toLocaleLowerCase()}`;
  const middleware = options.middleware || {};

  if (options.use) {
    (Array.isArray(options.use) ? options.use : [options.use]).forEach(use =>
      router.use(endpoint, use)
    );
  }

  const confirmExists = async (req, res, next) => {
    try {
      const row = await Model.query()
        .where({ [Model.primaryKey]: req.params.id })
        .first();
      if (!row) sendResponse(res, 'NOT_FOUND');
      else {
        req.document = row;
        next();
      }
    } catch (err) {
      // TODO: real error logging
      console.error(err);
      sendResponse(res, 'SERVER_ERROR');
    }
  };

  // READ
  if (middleware.read) router.get(middleware.read);
  router.get(`${endpoint}/:id`, confirmExists, async (req, res) => {
    sendResponse(res, null, req.document);
  });

  // CREATE
  if (middleware.create) router.get(middleware.create);
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

  // UPDATE
  if (middleware.update) router.get(middleware.update);
  router.put(`${endpoint}/:id`, confirmExists, (req, res) =>
    // update document by id
    Model.query()
      .where({ [Model.primaryKey]: req.params.id })
      .update(req.body)
      // fetch and return updated document
      .then(() => Model.byId(req.params.id).then(updated => sendResponse(res, null, updated)))
      .catch(err => {
        // TODO: real error logging
        console.error(err);
        sendResponse(res, 'SERVER_ERROR');
        // res.status(500).end();
      })
  );

  // DESTROY
  if (middleware.destroy) router.get(middleware.destroy);
  router.delete(`${endpoint}/:id`, confirmExists, (req, res) =>
    Model.query()
      .where({ [Model.primaryKey]: req.params.id })
      .del()
      .then(() => sendResponse(res, null))
      .catch(err => {
        // TODO: real error logging
        console.error(err);
        // res.status(500).end();
        sendResponse(res, 'SERVER_ERROR');
      })
  );

  return router;
}
