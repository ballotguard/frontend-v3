export function Table({ columns, rows, rowKey }) {
  return (
    <div className="overflow-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-3 py-2 font-medium text-neutral-600 whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey ? rowKey(r) : r.id} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 whitespace-nowrap">{c.cell ? c.cell(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
