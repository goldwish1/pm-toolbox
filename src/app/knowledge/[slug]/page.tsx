import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, getAllTools, getRelatedTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export default function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const relatedTools = getRelatedTools(tool);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
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

      {/* Header */}
      <div className="mb-8">
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

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-8">
        <p className="text-gray-600 text-base leading-relaxed">{tool.summary}</p>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">详细说明</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">使用步骤</h2>
        <ol className="space-y-3">
          {tool.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-sm text-gray-500 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Scenarios */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">适用场景</h2>
        <div className="flex flex-wrap gap-2">
          {tool.scenarios.map((scenario) => (
            <span
              key={scenario}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full"
            >
              #{scenario}
            </span>
          ))}
        </div>
      </section>

      {/* Template */}
      {tool.template && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-3">模板参考</h2>
          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500">{tool.template}</p>
          </div>
        </section>
      )}

      {/* Related Tools */}
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
