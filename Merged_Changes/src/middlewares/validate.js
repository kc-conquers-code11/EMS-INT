const { z } = require('zod');

// Generic validation middleware
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;

      // Get data from different sources
      if (source === 'body') {
        dataToValidate = req.body;
      } else if (source === 'params') {
        dataToValidate = req.params;
      } else if (source === 'query') {
        dataToValidate = req.query;
      }

      // Validate the data
      const validatedData = schema.parse(dataToValidate);

      // Attach validated data back to request
      if (source === 'body') {
        req.body = validatedData;
      } else if (source === 'params') {
        req.params = validatedData;
      } else if (source === 'query') {
        req.query = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { validate };
