import { api } from './client.js';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

export async function lookupProduct(code) {
  const { data } = await api.get(`/products/lookup/${encodeURIComponent(code)}`);
  return data;
}

export async function searchCustomers(search) {
  const { data } = await api.get('/customers', { params: { search } });
  return data;
}

export async function createBillPay(payload) {
  const { data } = await api.post('/billpay', payload);
  return data;
}

export async function fetchRecentBillPay(limit = 50) {
  const { data } = await api.get('/billpay', { params: { limit } });
  return data;
}
