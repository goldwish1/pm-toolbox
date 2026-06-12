import ChatInterface from "@/components/ChatInterface";

export default function AiRecommendPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 工具推荐</h1>
        <p className="text-gray-500">
          描述你遇到的项目管理问题，AI 将为你推荐最合适的工具
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
