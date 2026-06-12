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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/knowledge" className="hover:text-primary-600">
          知识库
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
        <p className="text-gray-500 text-sm">{tool.nameEn}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
            {tool.processGroup}
          </span>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {tool.knowledgeArea}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">{tool.summary}</p>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">详细说明</h2>
        <p className="text-gray-600 leading-relaxed">{tool.description}</p>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">使用步骤</h2>
        <ol className="space-y-3">
          {tool.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <span className="text-gray-600 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Scenarios */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">适用场景</h2>
        <div className="flex flex-wrap gap-2">
          {tool.scenarios.map((scenario) => (
            <span
              key={scenario}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              #{scenario}
            </span>
          ))}
        </div>
      </section>

      {/* Template */}
      {tool.template && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">模板参考</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-gray-600">{tool.template}</p>
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">相关工具</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
