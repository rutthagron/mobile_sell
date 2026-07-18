import { getPool, sql } from '../../config/db.js';
import { lookupByCode } from '../products/products.service.js';

/**
 * Resolve a customer's internal IDs from IdCus.
 */
async function findCustomerIds(request, idCus) {
  const result = await request
    .input('idCus', sql.NVarChar, idCus)
    .query(`SELECT TOP 1 IDs, IdCus, CusName FROM Customer WHERE IdCus = @idCus`);
  return result.recordset[0] || null;
}

/**
 * Generate a document number like WD-20260718-XXXX.
 */
function generateDocNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `WD-${y}${m}${d}-${rand}`;
}

/**
 * Create a withdrawal bill with multiple items inside a single transaction.
 * @param {{ idCus: string, note?: string, items: Array<{scannedCode:string,num:number,unit?:string}> }} payload
 * @param {number|null} userId
 */
export async function createBillPay(payload, userId) {
  const { idCus, note, items } = payload;
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();
  try {
    // Resolve customer
    const customer = await findCustomerIds(new sql.Request(transaction), idCus);
    if (!customer) {
      const err = new Error('ไม่พบลูกค้าตามรหัสที่ระบุ');
      err.status = 400;
      err.expose = true;
      throw err;
    }

    // Resolve every product before writing anything
    const resolved = [];
    for (const item of items) {
      const product = await lookupByCode(item.scannedCode);
      if (!product) {
        const err = new Error(`ไม่พบสินค้ารหัส ${item.scannedCode}`);
        err.status = 400;
        err.expose = true;
        throw err;
      }
      resolved.push({
        product,
        num: item.num,
        unit: item.unit || product.Unit || null,
      });
    }

    const docNumber = generateDocNumber();
    const createdRows = [];

    for (const row of resolved) {
      const request = new sql.Request(transaction);
      const result = await request
        .input('idsProduct', sql.Int, row.product.IDs)
        .input('idsCustomer', sql.Int, customer.IDs)
        .input('num', sql.Decimal(18, 2), row.num)
        .input('unit', sql.NVarChar, row.unit)
        .input('idsUser', sql.Int, userId)
        .input('docNumber', sql.VarChar, docNumber)
        .input('note', sql.NVarChar, note || null)
        .query(
          `INSERT INTO ListBillPay_Car
             (IDs_Product, IDs_Customer, Num, Unit, IDs_User, DocNumber, Status, Note, CreatedAt)
           OUTPUT INSERTED.IdAT
           VALUES
             (@idsProduct, @idsCustomer, @num, @unit, @idsUser, @docNumber, 'PENDING', @note, GETDATE())`
        );
      createdRows.push({
        idAT: result.recordset[0].IdAT,
        idPro: row.product.IdPro,
        proName: row.product.ProName,
        num: row.num,
        unit: row.unit,
      });
    }

    await transaction.commit();

    return {
      docNumber,
      customer: { idCus: customer.IdCus, cusName: customer.CusName },
      itemCount: createdRows.length,
      items: createdRows,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

/**
 * List recent withdrawal records (most recent first).
 * @param {number} limit
 */
export async function listRecent(limit = 50) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('limit', sql.Int, limit)
    .query(
      `SELECT TOP (@limit)
         b.IdAT, b.DocNumber, b.Num, b.Unit, b.Status, b.Note, b.CreatedAt,
         p.IdPro, p.ProName,
         c.IdCus, c.CusName,
         u.Users AS UserFullName
       FROM ListBillPay_Car b
       LEFT JOIN Product p ON p.IDs = b.IDs_Product
       LEFT JOIN Customer c ON c.IDs = b.IDs_Customer
       LEFT JOIN MA_User u ON u.IdAt = b.IDs_User
       ORDER BY b.CreatedAt DESC, b.IdAT DESC`
    );
  return result.recordset;
}
