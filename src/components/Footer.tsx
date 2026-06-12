export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧰</span>
            <span className="font-semibold text-gray-900">PM Toolbox</span>
          </div>
          <p className="text-gray-500 text-sm">
            项目管理工具箱 — 基于 PMBOK 五大过程组 × 十大知识领域
          </p>
        </div>
      </div>
    </footer>
  );
}