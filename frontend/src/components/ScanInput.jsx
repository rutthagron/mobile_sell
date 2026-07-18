import { useState } from 'react';
import { lookupProduct } from '../api/services.js';
import { useCartStore } from '../store/cartStore.js';
import BarcodeScanner from './BarcodeScanner.jsx';

/**
 * Manual code entry + camera scan. Looks up the product and adds it to the cart.
 */
export default function ScanInput() {
  const addItem = useCartStore((s) => s.addItem);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  async function handleLookup(rawCode) {
    const value = String(rawCode ?? code).trim();
    if (!value) return;
    setLoading(true);
    setMessage(null);
    try {
      const product = await lookupProduct(value);
      addItem({
        scannedCode: value,
        idPro: product.IdPro,
        proName: product.ProName,
        num: 1,
        unit: product.Unit || '',
        matchedBy: product.matchedBy,
      });
      setMessage({ type: 'ok', text: `เพิ่ม: ${product.ProName}` });
      setCode('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'ไม่พบสินค้า',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleDetected(detected) {
    setShowCamera(false);
    handleLookup(detected);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          placeholder="สแกน / ป้อนบาร์โค้ด หรือ รหัสสินค้า"
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          className="flex-1 rounded-md border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={() => handleLookup()}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? '...' : 'เพิ่ม'}
        </button>
        <button
          onClick={() => setShowCamera(true)}
          className="rounded-md bg-slate-700 px-4 py-3 font-medium text-white"
          title="เปิดกล้อง"
        >
          📷
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === 'ok' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {showCamera && (
        <BarcodeScanner
          onDetected={handleDetected}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
