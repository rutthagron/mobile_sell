import { useCartStore } from '../store/cartStore.js';

/**
 * Editable list of items in the withdrawal cart.
 * Renders as stacked cards on mobile and a table on larger screens.
 */
export default function CartTable() {
  const items = useCartStore((s) => s.items);
  const updateNum = useCartStore((s) => s.updateNum);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 py-8 text-center text-slate-400">
        ยังไม่มีรายการในตะกร้า
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Mobile: cards */}
      <div className="space-y-2 sm:hidden">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.proName}</p>
                <p className="text-xs text-slate-500">
                  {item.idPro}
                  {item.matchedBy === 'IdPro' && (
                    <span className="ml-1 text-amber-500">(IdPro)</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="shrink-0 rounded p-1 text-red-500 active:bg-red-50"
                title="ลบ"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => updateNum(i, Math.max(0, item.num - 1))}
                className="h-10 w-10 rounded-md border border-slate-300 text-lg active:bg-slate-100"
              >
                −
              </button>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={item.num}
                onChange={(e) => updateNum(i, Number(e.target.value))}
                className="h-10 w-20 rounded-md border border-slate-300 text-center"
              />
              <button
                onClick={() => updateNum(i, item.num + 1)}
                className="h-10 w-10 rounded-md border border-slate-300 text-lg active:bg-slate-100"
              >
                +
              </button>
              <span className="text-sm text-slate-500">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-md border border-slate-200 sm:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-3 py-2">สินค้า</th>
              <th className="px-3 py-2">รหัส</th>
              <th className="w-28 px-3 py-2">จำนวน</th>
              <th className="px-3 py-2">หน่วย</th>
              <th className="w-12 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-3 py-2">{item.proName}</td>
                <td className="px-3 py-2 text-slate-500">
                  {item.idPro}
                  {item.matchedBy === 'IdPro' && (
                    <span className="ml-1 text-xs text-amber-500">(IdPro)</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.num}
                    onChange={(e) => updateNum(i, Number(e.target.value))}
                    className="w-20 rounded border border-slate-300 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">{item.unit}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => removeItem(i)}
                    className="text-red-500 hover:text-red-700"
                    title="ลบ"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
