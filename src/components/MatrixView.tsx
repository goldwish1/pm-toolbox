import Link from "next/link";
import {
  processGroups,
  knowledgeAreas,
  getToolsByProcessGroupAndArea,
} from "@/lib/tools";

interface MatrixViewProps {
  selectedGroup?: string;
  selectedArea?: string;
}

export default function MatrixView({ selectedGroup = "", selectedArea = "" }: MatrixViewProps) {
  const groupsToShow = selectedGroup
    ? processGroups.filter((g) => g === selectedGroup)
    : processGroups;

  const areasToShow = selectedArea
    ? knowledgeAreas.filter((a) => a === selectedArea)
    : knowledgeAreas;

  return (
    <div className="space-y-8">
      {groupsToShow.map((group) => {
        const groupTools = areasToShow.flatMap((area) =>
          getToolsByProcessGroupAndArea(group, area)
        );
        if (groupTools.length === 0) return null;

        return (
          <div key={group}>
            <h3 className="text-xs font-medium text-gray-400 mb-3 pb-2 border-b border-gray-100">
              {group}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {areasToShow.map((area) => {
                const tools = getToolsByProcessGroupAndArea(group, area);
                if (tools.length === 0) return null;
                return (
                  <div key={`${group}-${area}`} className="py-1">
                    <div className="text-xs text-gray-400 mb-1.5">{area}</div>
                    <div className="space-y-0.5">
                      {tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/knowledge/${tool.slug}`}
                          className="block text-sm text-gray-600 hover:text-primary-500 hover:bg-gray-50 px-2 py-1 -mx-2 rounded-md transition-colors"
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
        );
      })}
    </div>
  );
}
