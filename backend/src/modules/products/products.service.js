import { getPool, sql } from '../../config/db.js';

/**
 * Look up a product by scanned code.
 * Tries Barcode first, then falls back to IdPro.
 * @param {string} code
 */
export async function lookupByCode(code) {
  const pool = await getPool();

  const byBarcode = await pool
    .request()
    .input('code', sql.NVarChar, code)
    .query(
      `SELECT TOP 1 IDs, IdPro, ProName, Unit, Barcode
       FROM Product
       WHERE Barcode = @code`
    );

  if (byBarcode.recordset[0]) {
    return { ...byBarcode.recordset[0], matchedBy: 'Barcode' };
  }

  const byIdPro = await pool
    .request()
    .input('code', sql.NVarChar, code)
    .query(
      `SELECT TOP 1 IDs, IdPro, ProName, Unit, Barcode
       FROM Product
       WHERE IdPro = @code`
    );

  if (byIdPro.recordset[0]) {
    return { ...byIdPro.recordset[0], matchedBy: 'IdPro' };
  }

  return null;
}
