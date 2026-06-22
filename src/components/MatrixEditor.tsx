"use client";

import { useState } from "react";
import type { MatrixConfig } from "@/lib/tools";

interface Props {
  config: MatrixConfig;
  onValuesChange?: (values: Record<string, string>) => void;
}

export default function MatrixEditor({ config, onValuesChange }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    onValuesChange?.(next);
  };

  const { rowLabels, colLabels, cells } = config;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-900">矩阵模板</h2>
      </div>
      <div className="p-5 overflow-x-auto">
        <div
          className="grid gap-px bg-gray-200 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `auto repeat(${colLabels.length}, 1fr)`,
            gridTemplateRows: `auto repeat(${rowLabels.length}, 1fr)`,
          }}
        >
          {/* Corner cell */}
          <div className="bg-gray-50 p-3" />

          {/* Column headers */}
          {colLabels.map((label, ci) => (
            <div
              key={`col-${ci}`}
              className="bg-gray-50 p-3 text-center text-xs font-medium text-gray-500"
            >
              {label}
            </div>
          ))}

          {/* Rows */}
          {rowLabels.map((rowLabel, ri) => (
            <>
              {/* Row header */}
              <div className="bg-gray-50 p-3 flex items-center text-xs font-medium text-gray-500 whitespace-nowrap">
                {rowLabel}
              </div>
              {/* Cells */}
              {colLabels.map((_, ci) => {
                const cell = cells.find((c) => c.row === ri && c.col === ci);
                if (!cell) return <div key={`empty-${ri}-${ci}`} className="bg-white p-2" />;
                return (
                  <div key={cell.key} className="bg-white p-2">
                    <textarea
                      value={values[cell.key] || ""}
                      onChange={(e) => handleChange(cell.key, e.target.value)}
                      placeholder={cell.label}
                      rows={3}
                      className="w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 rounded border border-gray-100
                                 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                                 focus:border-primary-300 resize-none transition-all"
                    />
                    {cell.hint && (
                      <p className="mt-1 text-[10px] text-gray-400 leading-tight">{cell.hint}</p>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
