import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as billpayService from './billpay.service.js';

export const createBillPaySchema = z.object({
  idCus: z.string().min(1, 'กรุณาเลือกลูกค้า'),
  note: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        scannedCode: z.string().min(1, 'กรุณาระบุรหัสสินค้า'),
        num: z.coerce.number().positive('จำนวนต้องมากกว่า 0'),
        unit: z.string().max(50).optional(),
      })
    )
    .min(1, 'ต้องมีอย่างน้อย 1 รายการ'),
});

export const createHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub ?? null;
  const result = await billpayService.createBillPay(req.body, userId);
  res.status(201).json(result);
});

export const listHandler = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const rows = await billpayService.listRecent(limit);
  res.json(rows);
});
