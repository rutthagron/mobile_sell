import { getPool, sql } from '../../config/db.js';

/**
 * Search customers by IdCus or CusName.
 * @param {string} search
 */
export async function searchCustomers(search) {
  const pool = await getPool();
  const term = `%${search}%`;

  const result = await pool
    .request()
    .input('term', sql.NVarChar, term)
    .query(
      `SELECT TOP 50 IDs, IdCus, CusName
       FROM Customer
       WHERE (@term = '%%' OR IdCus LIKE @term OR CusName LIKE @term)
       ORDER BY CusName`
    );

  return result.recordset;
}
