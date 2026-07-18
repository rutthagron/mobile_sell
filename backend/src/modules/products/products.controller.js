import { asyncHandler } from '../../utils/asyncHandler.js';
import * as productsService from './products.service.js';

export const lookupHandler = asyncHandler(async (req, res) => {
  const code = String(req.params.code || '').trim();
  if (!code) {
    return res.status(400).json({ message: 'กรุณาระบุรหัสสินค้า' });
  }

  const product = await productsService.lookupByCode(code);
  if (!product) {
    return res.status(404).json({ message: 'ไม่พบสินค้าตามรหัสที่ระบุ' });
  }

  return res.json(product);
});
