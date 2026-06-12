"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { getAllTools } from "@/lib/tools";

interface RecommendedTool {
  slug: string;
  name: string;
  summary: string;
  processGroup: string;
  knowledgeArea: string;
}

interface SearchResult {
  reasoning: string;
  tools: RecommendedTool[];
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const hotTools = useMemo(() => getAllTools().slice(0, 4), []);

  const doSearch = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        setError("暂时无法获取推荐，请稍后重试");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("暂时无法获取推荐，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed || loading) return;
      doSearch(trimmed);
    },
    [query, loading, doSearch]
  );

  return (
    <div className="min-h-[calc(100vh-3rem)] flex flex-col">
      {/* Search Area */}
      <div
        className={`flex flex-col items-center transition-all duration-500 ease-out ${
          hasSearched ? "pt-8 pb-6" : "pt-[30vh] pb-12"
        }`}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
          PM Toolbox
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          描述你的问题，找到合适的项目管理工具
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl px-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="描述你遇到的项目管理问题..."
              className="w-full h-14 px-5 pr-12 text-base bg-white border border-gray-200 rounded-2xl
                         shadow-sm placeholder:text-gray-300
                         focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10
                         transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                         rounded-xl bg-primary-500 text-white
                         hover:bg-primary-600 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pb-16">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-1.5 py-12">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce-dot" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce-dot animation-delay-100" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce-dot animation-delay-200" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => doSearch(query.trim())}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              重试
            </button>
          </div>
        )}

        {/* Results */}
        {result && !loading && !error && (
          <div className="space-y-6">
            {/* AI Reasoning */}
            {result.reasoning && (
              <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-5 animate-fade-in-up">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-500 leading-relaxed">{result.reasoning}</p>
              </div>
            )}

            {/* Tool Cards */}
            {result.tools && result.tools.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.tools.map((tool, i) => (
                  <Link
                    key={tool.slug}
                    href={`/knowledge/${tool.slug}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-5
                               shadow-sm hover:shadow-md hover:-translate-y-0.5
                               transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <h3 className="font-semibold text-sm text-gray-900 mb-1.5">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {tool.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full">
                        {tool.processGroup}
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                        {tool.knowledgeArea}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No results fallback: show hot tools */}
            {(!result.tools || result.tools.length === 0) && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 text-center">
                  没有找到匹配的工具，以下是热门工具供参考：
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotTools.map((tool, i) => (
                    <Link
                      key={tool.slug}
                      href={`/knowledge/${tool.slug}`}
                      className="block bg-white rounded-2xl border border-gray-100 p-5
                                 shadow-sm hover:shadow-md hover:-translate-y-0.5
                                 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <h3 className="font-semibold text-sm text-gray-900 mb-1.5">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {tool.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full">
                          {tool.processGroup}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                          {tool.knowledgeArea}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
