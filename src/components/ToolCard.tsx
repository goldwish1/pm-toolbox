import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/knowledge/${tool.slug}`}
      className="block bg-white rounded-2xl border border-gray-100 p-5
                 shadow-sm hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200"
    >
      <h3 className="font-semibold text-sm text-gray-900 mb-1.5">
        {tool.name}
      </h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{tool.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full">
          {tool.processGroup}
        </span>
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
          {tool.knowledgeArea}
        </span>
      </div>
    </Link>
  );
}
