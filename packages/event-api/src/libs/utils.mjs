/* eslint import/prefer-default-export: 0 */
export const makeArray = val => (Array.isArray(val) ? val : [val]);

export const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export function sendResponse(res, err, data = {}) {
  let statusCode = 200;
  const headers = {
    'content-type': 'application/json; charset=utf-8',
  };

  const response = { data };

  if (err) {
    response.errors = makeArray(err).map(error => {
      if (typeof error === 'string') {
        statusCode = errorCodes[error] || 500;
        return { message: error };
      }

      if (error instanceof Error) {
        statusCode = errorCodes[error.message] || 500;
        return { message: error.message };
      }

      statusCode = 500;
      return { message: 'SERVER_ERROR' };
    });
  }

  return res
    .set(headers)
    .status(statusCode)
    .end(JSON.stringify(response));
}
