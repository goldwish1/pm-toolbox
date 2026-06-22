"use client";

import { useState, useCallback } from "react";
import type { TableConfig } from "@/lib/tools";

interface Props {
  config: TableConfig;
  onValuesChange?: (values: Record<string, string>) => void;
}

export default function TableEditor({ config, onValuesChange }: Props) {
  const [rows, setRows] = useState<Record<string, string>[]>([{}]);

  const emit = useCallback(
    (nextRows: Record<string, string>[]) => {
      const merged: Record<string, string> = {};
      nextRows.forEach((row, i) => {
        for (const [k, v] of Object.entries(row)) {
          merged[`${k}_${i}`] = v;
        }
      });
      onValuesChange?.(merged);
    },
    [onValuesChange]
  );

  const updateCell = (rowIndex: number, colKey: string, value: string) => {
    const next = rows.map((r, i) => (i === rowIndex ? { ...r, [colKey]: value } : r));
    setRows(next);
    emit(next);
  };

  const addRow = () => {
    const next = [...rows, {}];
    setRows(next);
    emit(next);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    const next = rows.filter((_, i) => i !== index);
    setRows(next);
    emit(next);
  };

  const { columns } = config;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-900">表格模板</h2>
        <button
          onClick={addRow}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary-600
                     bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加行
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-medium text-gray-400 pb-2 pr-3 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {columns.map((col) => (
                  <td key={col.key} className="pr-2 pb-2">
                    {col.type === "textarea" ? (
                      <textarea
                        value={row[col.key] || ""}
                        onChange={(e) => updateCell(ri, col.key, e.target.value)}
                        placeholder={col.placeholder}
                        rows={2}
                        className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                                   placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                                   focus:border-primary-300 resize-none transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[col.key] || ""}
                        onChange={(e) => updateCell(ri, col.key, e.target.value)}
                        placeholder={col.placeholder}
                        className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                                   placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                                   focus:border-primary-300 transition-all"
                      />
                    )}
                  </td>
                ))}
                <td className="pb-2 align-top">
                  <button
                    onClick={() => removeRow(ri)}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                    title="删除行"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
