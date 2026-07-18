import { asyncHandler } from '../../utils/asyncHandler.js';
import * as customersService from './customers.service.js';

export const searchHandler = asyncHandler(async (req, res) => {
  const search = String(req.query.search || '').trim();
  const customers = await customersService.searchCustomers(search);
  res.json(customers);
});
