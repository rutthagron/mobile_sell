/**
 * Build an Express middleware that validates a request part against a Zod schema.
 * @param {import('zod').ZodTypeAny} schema
 * @param {'body'|'query'|'params'} source
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: result.error.flatten(),
      });
    }
    req[source] = result.data;
    return next();
  };
}
