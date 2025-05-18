const { validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if there are validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // If there are errors, create an error and pass it to the error handler
    const error = new Error('Validation Error');
    error.statusCode = 400;
    error.errors = errors.array();
    
    next(error);
  };
};

module.exports = validate; 