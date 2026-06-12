"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg">🧰</span>
          <span className="font-semibold text-sm text-gray-900">PM Toolbox</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/knowledge"
            className={`text-sm transition-colors ${
              pathname.startsWith("/knowledge")
                ? "text-primary-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            知识库
          </Link>
        </nav>
      </div>
    </header>
  );
}
