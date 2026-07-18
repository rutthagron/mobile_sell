/**
 * Formats a SQL datetime string to Thai locale.
 */
function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('th-TH');
  } catch {
    return value;
  }
}

export default function RecentHistory({ rows, loading }) {
  if (loading) {
    return <p className="py-6 text-center text-slate-400">กำลังโหลด...</p>;
  }
  if (!rows || rows.length === 0) {
    return <p className="py-6 text-center text-slate-400">ยังไม่มีประวัติ</p>;
  }

  return (
    <>
      {/* Mobile: cards */}
      <ul className="space-y-2 sm:hidden">
        {rows.map((r) => (
          <li
            key={r.IdAT}
            className="rounded-lg border border-slate-200 p-3 text-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate font-medium">{r.ProName}</p>
              <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs">
                {r.Status}
              </span>
            </div>
            <p className="text-slate-600">
              {r.Num} {r.Unit} · {r.CusName}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {r.DocNumber} · {formatDate(r.CreatedAt)}
            </p>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-md border border-slate-200 sm:block">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-3 py-2">เลขที่</th>
            <th className="px-3 py-2">สินค้า</th>
            <th className="px-3 py-2">ลูกค้า</th>
            <th className="px-3 py-2">จำนวน</th>
            <th className="px-3 py-2">สถานะ</th>
            <th className="px-3 py-2">เวลา</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.IdAT} className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-500">{r.DocNumber}</td>
              <td className="px-3 py-2">{r.ProName}</td>
              <td className="px-3 py-2">{r.CusName}</td>
              <td className="px-3 py-2">
                {r.Num} {r.Unit}
              </td>
              <td className="px-3 py-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                  {r.Status}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-500">
                {formatDate(r.CreatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
