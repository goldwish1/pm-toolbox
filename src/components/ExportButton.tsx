"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import type { TemplateField } from "@/lib/tools";
import { generateMarkdown, generateHTML } from "./TemplateEditor";

interface Props {
  values: Record<string, string>;
  fields: TemplateField[];
  toolName: string;
  templateRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ values, fields, toolName, templateRef }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopyMD = async () => {
    const md = generateMarkdown(values, fields, toolName);
    await navigator.clipboard.writeText(md);
    showToast("Markdown 已复制到剪贴板");
  };

  const handleExportPNG = async () => {
    if (!templateRef.current) return;
    const canvas = await html2canvas(templateRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `${toolName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("PNG 已下载");
  };

  const handleCopyToFeishu = async () => {
    const html = generateHTML(values, fields, toolName);
    const plain = generateMarkdown(values, fields, toolName);
    const blob = new Blob([html], { type: "text/html" });
    const item = new ClipboardItem({
      "text/html": blob,
      "text/plain": new Blob([plain], { type: "text/plain" }),
    });
    await navigator.clipboard.write([item]);
    showToast("已复制，在飞书中粘贴即可");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyMD}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          复制 MD
        </button>
        <button
          onClick={handleExportPNG}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          导出 PNG
        </button>
        <button
          onClick={handleCopyToFeishu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          复制到飞书
        </button>
      </div>

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg
                        animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
