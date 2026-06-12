import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { getAllTools } from "@/lib/tools";

export default function HomePage() {
  const tools = getAllTools();
  const hotTools = tools.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            项目管理工具箱
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            基于 PMBOK 五大过程组 × 十大知识领域，为项目经理提供标准工具知识库与智能推荐
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/knowledge"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              浏览知识库
            </Link>
            <Link
              href="/ai-recommend"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-400 transition-colors border border-primary-400"
            >
              AI 推荐工具
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">工具知识库</h3>
            <p className="text-sm text-gray-500">
              按五大过程组和十大知识领域浏览标准项目管理工具
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI 推荐</h3>
            <p className="text-sm text-gray-500">
              描述你遇到的问题，AI 为你推荐最合适的工具
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">快速搜索</h3>
            <p className="text-sm text-gray-500">
              搜索工具名称、用途或适用场景，快速找到所需工具
            </p>
          </div>
        </div>
      </section>

      {/* Hot Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">热门工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}