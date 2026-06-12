"use client";

import { Suspense } from "react";
import MatrixView from "@/components/MatrixView";
import { processGroups, knowledgeAreas } from "@/lib/tools";
import { useState } from "react";

function KnowledgeContent() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">工具知识库</h1>
        <p className="text-sm text-gray-400">
          按 PMBOK 五大过程组 × 十大知识领域浏览
        </p>
      </div>

      {/* Pill Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup("")}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              selectedGroup === ""
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            全部过程组
          </button>
          {processGroups.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g === selectedGroup ? "" : g)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedGroup === g
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedArea("")}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              selectedArea === ""
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            全部知识领域
          </button>
          {knowledgeAreas.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedArea(a === selectedArea ? "" : a)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedArea === a
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix View */}
      <MatrixView
        selectedGroup={selectedGroup}
        selectedArea={selectedArea}
      />
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">加载中...</div>}>
      <KnowledgeContent />
    </Suspense>
  );
}
