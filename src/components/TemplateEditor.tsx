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

// 导出辅助函数：根据 values + fields 生成 Markdown 表格
export function generateMarkdown(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  lines.push("| 字段 | 内容 |");
  lines.push("|------|------|");

  for (const field of fields) {
    const value = values[field.key] || "（待填写）";
    const cell = value.replace(/\n/g, "<br>");
    lines.push(`| ${field.label} | ${cell} |`);
  }

  lines.push("");
  return lines.join("\n");
}

// 生成飞书文档专用的 Markdown（lark doc create --stdin 使用）
// 排版更丰富：标题 + 分割线 + 表格 + 分区标题
export function generateFeishuContent(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 表格：所有 text 类型的字段
  const textFields = fields.filter((f) => f.type === "text");
  if (textFields.length > 0) {
    lines.push("## 基本信息");
    lines.push("");
    lines.push("| 字段 | 内容 |");
    lines.push("|------|------|");
    for (const field of textFields) {
      const value = values[field.key] || "（待填写）";
      lines.push(`| ${field.label} | ${value} |`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // 分区：每个 textarea 字段独立一个区块
  const textareaFields = fields.filter((f) => f.type === "textarea");
  for (const field of textareaFields) {
    const value = values[field.key] || "（待填写）";
    lines.push(`## ${field.label}`);
    lines.push("");
    lines.push(value);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

// 生成富文本 HTML 模板卡片，粘贴到飞书时渲染为与网页端一致的卡片样式
export function generateHTML(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const rows = fields
    .map((field) => {
      const value = values[field.key] || '<span style="color:#d1d5db">（待填写）</span>';
      const cell = value.replace(/\n/g, "<br>");
      return `<tr>
<td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-weight:500;color:#6b7280;font-size:13px;width:110px;vertical-align:top">${field.label}</td>
<td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:13px;line-height:1.6">${cell}</td>
</tr>`;
    })
    .join("");

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
<div style="padding:12px 20px;border-bottom:1px solid #f3f4f6;background:#f9fafb">
<h2 style="font-size:14px;font-weight:600;color:#111827;margin:0">${toolName} 模板</h2>
</div>
<div style="padding:20px">
<table style="border-collapse:collapse;width:100%">
<tbody>${rows}</tbody>
</table>
</div>
</div>`;
}
