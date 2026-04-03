const { ZodError } = require('zod');

/**
 * Express middleware factory — validates req.body against a Zod schema.
 * Returns 400 with the first validation error message on failure.
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const message = result.error.errors[0]?.message || 'Invalid input';
        return res.status(400).json({ message });
    }
    req.body = result.data; // replace with sanitised/coerced data
    next();
};

module.exports = validate;
