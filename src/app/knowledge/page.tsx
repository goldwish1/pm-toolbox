"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MatrixView from "@/components/MatrixView";
import ToolCard from "@/components/ToolCard";
import { searchTools, processGroups, knowledgeAreas } from "@/lib/tools";
import { useState } from "react";

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const searchResults = query ? searchTools(query) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">工具知识库</h1>
        <p className="text-gray-500">
          按 PMBOK 五大过程组 × 十大知识领域浏览标准项目管理工具
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">全部过程组</option>
          {processGroups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">全部知识领域</option>
          {knowledgeAreas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Search Results */}
      {searchResults !== null && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            搜索 &ldquo;{query}&rdquo; 的结果（{searchResults.length} 个工具）
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">未找到匹配的工具</p>
          )}
        </div>
      )}

      {/* Matrix View */}
      {searchResults === null && <MatrixView />}
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <KnowledgeContent />
    </Suspense>
  );
}
