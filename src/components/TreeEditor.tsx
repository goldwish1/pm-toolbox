"use client";

import { useState } from "react";
import type { TreeConfig } from "@/lib/tools";

interface Props {
  config: TreeConfig;
  onValuesChange?: (values: Record<string, string>) => void;
}

export default function TreeEditor({ config, onValuesChange }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    onValuesChange?.(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-900">层级模板</h2>
      </div>
      <div className="p-5">
        {/* Root */}
        <div className="relative pl-6 border-l-2 border-primary-300 pb-4">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
          <label className="block text-xs font-medium text-gray-500 mb-1">{config.rootLabel}</label>
          <input
            type="text"
            value={values.root || ""}
            onChange={(e) => handleChange("root", e.target.value)}
            placeholder="输入项目名称"
            className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                       placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                       focus:border-primary-300 transition-all"
          />
        </div>

        {/* Levels */}
        {config.levels.map((level, li) => (
          <div key={level.key} className="relative pl-6 border-l-2 border-primary-200 pb-4 last:pb-0">
            <div className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 bg-primary-300 rounded-full border-2 border-white" />
            <label className="block text-xs font-medium text-gray-500 mb-1">{level.label}</label>
            <textarea
              value={values[level.key] || ""}
              onChange={(e) => handleChange(level.key, e.target.value)}
              placeholder={level.placeholder}
              rows={3 + li}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                         placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                         focus:border-primary-300 resize-none transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
