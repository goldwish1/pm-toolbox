import Link from "next/link";
import {
  processGroups,
  knowledgeAreas,
  getToolsByProcessGroupAndArea,
} from "@/lib/tools";

export default function MatrixView() {
  return (
    <div className="space-y-10">
      {processGroups.map((group) => (
        <div key={group}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            {group}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {knowledgeAreas.map((area) => {
              const tools = getToolsByProcessGroupAndArea(group, area);
              if (tools.length === 0) return null;
              return (
                <div
                  key={`${group}-${area}`}
                  className="bg-white rounded-lg border border-gray-200 p-3"
                >
                  <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    {area}
                  </div>
                  <div className="space-y-1.5">
                    {tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/knowledge/${tool.slug}`}
                        className="block text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
