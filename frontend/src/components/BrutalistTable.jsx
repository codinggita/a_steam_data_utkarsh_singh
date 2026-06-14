import React from 'react';

export const BrutalistTable = ({
  columns = [],
  data = [],
  onRowClick = null,
  emptyMessage = 'NO RECORDS FOUND IN ARCHIVE.',
  loading = false
}) => {
  return (
    <div className="w-full overflow-x-auto border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] bg-white dark:bg-black">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black text-white dark:bg-white dark:text-black border-b-2 border-black dark:border-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-3 font-headline font-black text-xs uppercase tracking-wider border-r border-black dark:border-white last:border-r-0 ${
                  col.className || ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-sm">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center uppercase animate-pulse">
                // RETRIEVING REGISTER DATA...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-black/50 dark:text-white/50 uppercase">
                // {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || row.appid || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-black dark:border-white last:border-b-0 hover:bg-primary/15 transition-colors ${
                  onRowClick ? 'cursor-crosshair' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-3 border-r border-black dark:border-white last:border-r-0 truncate max-w-[200px] ${
                      col.className || ''
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrutalistTable;
