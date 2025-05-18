import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './errorHandler';

/**
 * Middleware to check for validation errors
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if there are validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // If there are errors, create an ApiError and pass it to the error handler
    const error: ApiError = new Error('Validation Error');
    error.statusCode = 400;
    error.errors = errors.array();
    
    next(error);
  };
};

export default validate; 