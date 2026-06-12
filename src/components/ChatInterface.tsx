"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  tools?: Array<{
    slug: string;
    name: string;
    summary: string;
    processGroup: string;
    knowledgeArea: string;
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好！我是 PM 工具推荐助手。请描述你当前遇到的项目管理问题，我会为你推荐最合适的工具。\n\n例如：\n- \"项目范围一直在变，怎么办？\"\n- \"团队成员不清楚自己的职责\"\n- \"如何评估项目风险？\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input.trim() }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reasoning,
          tools: data.tools,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，暂时无法获取推荐结果，请稍后再试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[600px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.tools && msg.tools.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      推荐工具
                    </p>
                    {msg.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/knowledge/${tool.slug}`}
                        className="block bg-white rounded-lg border border-gray-200 p-3 hover:border-primary-300 transition-colors"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {tool.name}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {tool.summary}
                        </p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
                            {tool.processGroup}
                          </span>
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tool.knowledgeArea}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述你遇到的项目管理问题..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
