import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools, getRelatedTools } from "@/lib/tools";
import ToolDetailClient from "@/components/ToolDetailClient";

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

  return <ToolDetailClient tool={tool} relatedTools={relatedTools} />;
}
