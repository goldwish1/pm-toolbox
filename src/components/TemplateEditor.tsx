"use client";

import { useState } from "react";
import type { TemplateField } from "@/lib/tools";

interface Props {
  fields: TemplateField[];
  onValuesChange?: (values: Record<string, string>) => void;
}

export default function TemplateEditor({ fields, onValuesChange }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState(false);

  const handleChange = (key: string, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    onValuesChange?.(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 顶部：模式切换 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-900">模板</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {showHints ? "带指南" : "纯模板"}
          </span>
          <button
            onClick={() => setShowHints(!showHints)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              showHints ? "bg-primary-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                showHints ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 字段列表 */}
      <div className="p-5 space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                           placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 resize-none transition-all"
              />
            ) : (
              <input
                type="text"
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                           placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                           focus:border-primary-300 transition-all"
              />
            )}
            {showHints && field.hint && (
              <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
