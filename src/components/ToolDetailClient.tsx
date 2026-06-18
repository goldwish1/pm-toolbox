"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Tool } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import TemplateEditor from "@/components/TemplateEditor";
import ExportButton from "@/components/ExportButton";

export default function ToolDetailClient({
  tool,
  relatedTools,
}: {
  tool: Tool;
  relatedTools: Tool[];
}) {
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const templateRef = useRef<HTMLDivElement | null>(null);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [scenariosOpen, setScenariosOpen] = useState(false);

  const hasTemplateFields = tool.templateFields && tool.templateFields.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* 面包屑 */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/knowledge" className="hover:text-gray-600 transition-colors">
          知识库
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{tool.name}</span>
      </nav>

      {/* 工具头部 */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{tool.name}</h1>
        <p className="text-sm text-gray-400">{tool.nameEn}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
            {tool.processGroup}
          </span>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
            {tool.knowledgeArea}
          </span>
        </div>
      </div>

      {/* 概述 */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <p className="text-gray-600 text-base leading-relaxed">{tool.summary}</p>
      </div>

      {/* 模板工作区（核心区域） */}
      {hasTemplateFields ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">模板</h2>
            <ExportButton
              values={templateValues}
              fields={tool.templateFields!}
              toolName={tool.name}
              templateRef={templateRef}
            />
          </div>
          <div ref={templateRef}>
            <TemplateEditor
              fields={tool.templateFields!}
              onValuesChange={setTemplateValues}
            />
          </div>
        </div>
      ) : (
        /* 降级：无 templateFields 的工具显示旧版模板 */
        tool.template && (
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">模板参考</h2>
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">{tool.template}</p>
            </div>
          </section>
        )
      )}

      {/* 详细说明 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">详细说明</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
      </section>

      {/* 使用步骤（可折叠，默认折叠） */}
      <section className="mb-6">
        <button
          onClick={() => setStepsOpen(!stepsOpen)}
          className="flex items-center gap-2 text-base font-semibold text-gray-900 w-full text-left"
        >
          <svg
            className={`w-4 h-4 transition-transform ${stepsOpen ? "rotate-90" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          使用步骤
        </button>
        {stepsOpen && (
          <ol className="mt-3 space-y-3">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-500 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* 适用场景（可折叠，默认折叠） */}
      <section className="mb-6">
        <button
          onClick={() => setScenariosOpen(!scenariosOpen)}
          className="flex items-center gap-2 text-base font-semibold text-gray-900 w-full text-left"
        >
          <svg
            className={`w-4 h-4 transition-transform ${scenariosOpen ? "rotate-90" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          适用场景
        </button>
        {scenariosOpen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tool.scenarios.map((scenario) => (
              <span
                key={scenario}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full"
              >
                #{scenario}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 相关工具 */}
      {relatedTools.length > 0 && (
        <section className="border-t border-gray-100 pt-8 mt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">相关工具</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
