export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  // Redact potential PII from server logs
  const sanitizedMessage = (err.message || 'Internal server error')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(\+91\s?)?[6-9]\d{9}/g, '[REDACTED_PHONE]')
    .replace(/\b\d{4}\b/g, '[REDACTED_PIN]');

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl} - Status ${statusCode}: ${sanitizedMessage}`);
  }

  // Return JSON error response matching API contract: { error: message }
  const clientMessage =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal server error';

  res.status(statusCode).json({ error: clientMessage });
}
