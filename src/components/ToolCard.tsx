import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/knowledge/${tool.slug}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {tool.name}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tool.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
          {tool.processGroup}
        </span>
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
          {tool.knowledgeArea}
        </span>
      </div>
    </Link>
  );
}