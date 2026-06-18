import toolsData from "../../data/tools.json";

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
  hint?: string;
}

export interface Tool {
  slug: string;
  name: string;
  nameEn: string;
  processGroup: string;
  knowledgeArea: string;
  summary: string;
  description: string;
  steps: string[];
  scenarios: string[];
  template: string;
  templateFields?: TemplateField[];
}

export const processGroups = ["启动", "规划", "执行", "监控", "收尾"];

export const knowledgeAreas = [
  "范围", "时间", "成本", "质量", "资源",
  "沟通", "风险", "采购", "干系人", "整合",
];

export function getAllTools(): Tool[] {
  return toolsData as Tool[];
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsData.find((t) => (t as Tool).slug === slug) as Tool | undefined;
}

export function getToolsByProcessGroup(group: string): Tool[] {
  return toolsData.filter((t) => (t as Tool).processGroup === group) as Tool[];
}

export function getToolsByKnowledgeArea(area: string): Tool[] {
  return toolsData.filter((t) => (t as Tool).knowledgeArea === area) as Tool[];
}

export function getToolsByProcessGroupAndArea(
  group: string,
  area: string
): Tool[] {
  return toolsData.filter(
    (t) =>
      (t as Tool).processGroup === group && (t as Tool).knowledgeArea === area
  ) as Tool[];
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return toolsData.filter(
    (t) =>
      (t as Tool).name.toLowerCase().includes(q) ||
      (t as Tool).nameEn.toLowerCase().includes(q) ||
      (t as Tool).summary.toLowerCase().includes(q) ||
      (t as Tool).scenarios.some((s) => s.toLowerCase().includes(q))
  ) as Tool[];
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  const related = toolsData.filter(
    (t) =>
      (t as Tool).slug !== tool.slug &&
      ((t as Tool).processGroup === tool.processGroup ||
        (t as Tool).knowledgeArea === tool.knowledgeArea)
  ) as Tool[];
  return related.slice(0, limit);
}
