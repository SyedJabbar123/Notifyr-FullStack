import { AppError } from '../utils/AppError.js';

// Generic body validator factory — pass a zod schema, get middleware back.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      return next(new AppError('VALIDATION_ERROR', message, 400));
    }
    req.body = result.data; // parsed/coerced values
    next();
  };
}
