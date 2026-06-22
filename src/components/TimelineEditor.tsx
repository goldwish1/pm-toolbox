"use client";

import { useState, useCallback } from "react";
import type { TimelineConfig } from "@/lib/tools";

interface Props {
  config: TimelineConfig;
  onValuesChange?: (values: Record<string, string>) => void;
}

interface MilestoneRow {
  date: string;
  desc: string;
}

export default function TimelineEditor({ config, onValuesChange }: Props) {
  const [milestones, setMilestones] = useState<MilestoneRow[]>([
    { date: "", desc: "" },
  ]);

  const emit = useCallback(
    (next: MilestoneRow[]) => {
      const merged: Record<string, string> = {};
      next.forEach((m, i) => {
        merged[`date_${i}`] = m.date;
        merged[`desc_${i}`] = m.desc;
      });
      onValuesChange?.(merged);
    },
    [onValuesChange]
  );

  const update = (index: number, field: keyof MilestoneRow, value: string) => {
    const next = milestones.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMilestones(next);
    emit(next);
  };

  const add = () => {
    const next = [...milestones, { date: "", desc: "" }];
    setMilestones(next);
    emit(next);
  };

  const remove = (index: number) => {
    if (milestones.length <= 1) return;
    const next = milestones.filter((_, i) => i !== index);
    setMilestones(next);
    emit(next);
  };

  const hasContent = milestones.some((m) => m.date || m.desc);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-900">时间轴模板</h2>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary-600
                     bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加里程碑
        </button>
      </div>

      <div className="p-5">
        {/* Visual Timeline */}
        {hasContent && (
          <div className="relative mb-8 pt-4">
            {/* Timeline line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200" />

            {/* Milestone nodes */}
            <div className="flex items-start justify-between gap-2">
              {milestones
                .filter((m) => m.date || m.desc)
                .map((m, i) => (
                  <div key={i} className="flex-1 text-center relative min-w-0">
                    {/* Node dot */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full border-2 border-white shadow-sm" />
                    {/* Date */}
                    <div className="mt-4 text-xs font-medium text-gray-500 truncate">
                      {m.date || "日期"}
                    </div>
                    {/* Description */}
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {m.desc || "描述"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Input table */}
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={m.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  placeholder="日期（如 2026-01-15）"
                  className="w-36 px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                             placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                             focus:border-primary-300 transition-all"
                />
                <input
                  type="text"
                  value={m.desc}
                  onChange={(e) => update(i, "desc", e.target.value)}
                  placeholder="里程碑描述"
                  className="flex-1 px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                             placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200
                             focus:border-primary-300 transition-all"
                />
              </div>
              <button
                onClick={() => remove(i)}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors mt-0.5"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
