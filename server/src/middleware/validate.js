import { HttpError } from './errorHandler.js';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        const field = firstError.path.join('.');
        const message = field ? `${field}: ${firstError.message}` : firstError.message;
        return next(new HttpError(400, message));
      }
      return next(new HttpError(400, 'Invalid request data'));
    }
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        const field = firstError.path.join('.');
        const message = field ? `${field}: ${firstError.message}` : firstError.message;
        return next(new HttpError(400, message));
      }
      return next(new HttpError(400, 'Invalid query parameters'));
    }
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        const field = firstError.path.join('.');
        const message = field ? `${field}: ${firstError.message}` : firstError.message;
        return next(new HttpError(400, message));
      }
      return next(new HttpError(400, 'Invalid route parameters'));
    }
  };
}
