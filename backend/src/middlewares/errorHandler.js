/* eslint-disable no-unused-vars */
/**
 * Centralized error handler. Keeps SQL/internal details out of responses.
 */
export function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.expose ? err.message : 'เกิดข้อผิดพลาดภายในระบบ',
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: 'ไม่พบเส้นทางที่ร้องขอ' });
}
