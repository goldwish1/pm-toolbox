import { NextRequest, NextResponse } from "next/server";
import { getAllTools } from "@/lib/tools";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "请提供问题描述" },
        { status: 400 }
      );
    }

    const tools = getAllTools();
    const toolsContext = tools
      .map(
        (t) =>
          `- ${t.name}（${t.nameEn}）\n  过程组：${t.processGroup} | 领域：${t.knowledgeArea}\n  用途：${t.summary}\n  适用场景：${t.scenarios.join("、")}`
      )
      .join("\n\n");

    const prompt = `你是一个项目管理工具推荐专家。根据用户的问题，从以下工具库中推荐最相关的 1-3 个工具。

工具库：
${toolsContext}

用户问题：${question}

请按以下 JSON 格式回复（不要包含其他内容）：
{
  "reasoning": "你的推荐理由和分析（中文，2-3句话）",
  "tools": [
    {
      "slug": "工具的slug",
      "name": "工具名称",
      "summary": "工具用途",
      "processGroup": "过程组",
      "knowledgeArea": "知识领域"
    }
  ]
}

注意：只推荐工具库中存在的工具，slug 必须与工具库一致。`;

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback: rule-based recommendation
      return handleFallbackRecommendation(question, tools);
    }

    // Try DeepSeek first
    if (process.env.DEEPSEEK_API_KEY) {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "你是一个项目管理工具推荐专家。只返回 JSON。" },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
          }),
        }
      );

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return NextResponse.json(result);
    }

    // Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "你是一个项目管理工具推荐专家。只返回 JSON。" },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
          }),
        }
      );

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return NextResponse.json(result);
    }

    // Try Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const result = JSON.parse(data.content[0].text);
      return NextResponse.json(result);
    }

    return handleFallbackRecommendation(question, tools);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      {
        reasoning: "抱歉，AI 推荐暂时不可用，请稍后再试。",
        tools: [],
      },
      { status: 200 }
    );
  }
}

function handleFallbackRecommendation(question: string, tools: any[]) {
  const q = question.toLowerCase();
  const keywords: Record<string, string[]> = {
    risk: ["风险", "risk", "不确定", "威胁", "机会"],
    scope: ["范围", "scope", "蔓延", "变更", "需求"],
    time: ["时间", "进度", "delay", "延期", "工期", "deadline"],
    cost: ["成本", "cost", "预算", "budget", "花费"],
    quality: ["质量", "quality", "缺陷", "bug", "标准"],
    resource: ["资源", "resource", "人员", "团队", "职责", "冲突"],
    communication: ["沟通", "communication", "汇报", "会议", "信息"],
    stakeholder: ["干系人", "stakeholder", "相关方"],
    procurement: ["采购", "procurement", "供应商", "外包"],
  };

  const matchedAreas: string[] = [];
  for (const [area, words] of Object.entries(keywords)) {
    if (words.some((w) => q.includes(w))) {
      const areaMap: Record<string, string> = {
        risk: "风险",
        scope: "范围",
        time: "时间",
        cost: "成本",
        quality: "质量",
        resource: "资源",
        communication: "沟通",
        stakeholder: "干系人",
        procurement: "采购",
      };
      matchedAreas.push(areaMap[area]);
    }
  }

  let recommended = tools.filter(
    (t: any) =>
      matchedAreas.includes(t.knowledgeArea) ||
      t.scenarios.some((s: string) => q.includes(s))
  );

  if (recommended.length === 0) {
    recommended = tools.slice(0, 3);
  }

  return NextResponse.json({
    reasoning: `根据您的问题，我推荐以下与"${matchedAreas.join("、") || "项目管理"}"相关的工具：`,
    tools: recommended.slice(0, 3).map((t: any) => ({
      slug: t.slug,
      name: t.name,
      summary: t.summary,
      processGroup: t.processGroup,
      knowledgeArea: t.knowledgeArea,
    })),
  });
}