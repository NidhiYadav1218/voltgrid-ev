import { HttpError } from './errorHandler.js';

export function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, `Access forbidden: requires ${roles.join(' or ')} role`));
    }

    next();
  };
}
