import { useEffect, useState } from 'react';
import CustomerSelect from '../components/CustomerSelect.jsx';
import ScanInput from '../components/ScanInput.jsx';
import CartTable from '../components/CartTable.jsx';
import RecentHistory from '../components/RecentHistory.jsx';
import { useCartStore } from '../store/cartStore.js';
import { useAuthStore } from '../store/authStore.js';
import { createBillPay, fetchRecentBillPay } from '../api/services.js';

export default function ScanPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { customer, items, note, setNote, clear } = useCartStore();

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  async function loadRecent() {
    setLoadingRecent(true);
    try {
      setRecent(await fetchRecentBillPay(50));
    } catch {
      setRecent([]);
    } finally {
      setLoadingRecent(false);
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  async function handleSave() {
    setFeedback(null);
    if (!customer) {
      setFeedback({ type: 'error', text: 'กรุณาเลือกลูกค้าก่อน' });
      return;
    }
    if (items.length === 0) {
      setFeedback({ type: 'error', text: 'ยังไม่มีรายการในตะกร้า' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        idCus: customer.IdCus,
        note: note || undefined,
        items: items.map((i) => ({
          scannedCode: i.scannedCode,
          num: i.num,
          unit: i.unit || undefined,
        })),
      };
      const result = await createBillPay(payload);
      setFeedback({
        type: 'ok',
        text: `บันทึกสำเร็จ เลขที่ ${result.docNumber} (${result.itemCount} รายการ)`,
      });
      clear();
      loadRecent();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'บันทึกไม่สำเร็จ',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2.5 shadow-sm">
        <h1 className="truncate text-base font-semibold sm:text-lg">
          สแกนบาร์โค้ดเบิกสินค้า
        </h1>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="max-w-[80px] truncate text-slate-500 sm:max-w-none">
            {user?.fullName || user?.username}
          </span>
          <button
            onClick={logout}
            className="rounded-md px-2 py-1 text-red-600 active:bg-red-50"
          >
            ออก
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-3 pb-28 sm:p-4 sm:pb-4">

      <section className="space-y-4 rounded-lg bg-white p-3 shadow sm:p-4">
        <CustomerSelect />
        <ScanInput />
        <CartTable />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="หมายเหตุ (ถ้ามี)"
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />

        {feedback && (
          <p
            className={`text-sm ${
              feedback.type === 'ok' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {feedback.text}
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-lg bg-white p-3 shadow sm:p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">ประวัติล่าสุด</h2>
          <button onClick={loadRecent} className="text-sm text-blue-600 underline">
            รีเฟรช
          </button>
        </div>
        <RecentHistory rows={recent} loading={loadingRecent} />
      </section>
      </div>

      {/* Sticky action bar — always reachable with the thumb on mobile */}
      <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur">
        <button
          onClick={clear}
          className="rounded-md border border-slate-300 px-4 py-3 text-sm active:bg-slate-100"
        >
          ล้าง
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-md bg-emerald-600 py-3 font-medium text-white active:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : `บันทึกการเบิก${items.length ? ` (${items.length})` : ''}`}
        </button>
      </div>
    </div>
  );
}
