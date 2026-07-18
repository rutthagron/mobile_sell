import { useEffect, useRef, useState } from 'react';
import { searchCustomers } from '../api/services.js';
import { useCartStore } from '../store/cartStore.js';

/**
 * Debounced customer search + select box.
 */
export default function CustomerSelect() {
  const customer = useCartStore((s) => s.customer);
  const setCustomer = useCartStore((s) => s.setCustomer);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const data = await searchCustomers(term);
        setResults(data);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [term]);

  if (customer) {
    return (
      <div className="flex items-center justify-between rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3">
        <div>
          <span className="text-xs text-emerald-600">ลูกค้า</span>
          <p className="font-medium">
            {customer.CusName}{' '}
            <span className="text-slate-500">({customer.IdCus})</span>
          </p>
        </div>
        <button
          onClick={() => setCustomer(null)}
          className="text-sm text-emerald-700 underline"
        >
          เปลี่ยน
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={term}
        placeholder="ค้นหาลูกค้า (รหัส หรือ ชื่อ)"
        onChange={(e) => setTerm(e.target.value)}
        onFocus={() => setOpen(true)}
        className="w-full rounded-md border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {results.map((c) => (
            <li key={c.IDs}>
              <button
                onClick={() => {
                  setCustomer(c);
                  setOpen(false);
                  setTerm('');
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-100"
              >
                {c.CusName}{' '}
                <span className="text-slate-400">({c.IdCus})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
