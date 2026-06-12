"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧰</span>
            <span className="font-bold text-xl text-gray-900">PM Toolbox</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/knowledge"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              知识库
            </Link>
            <Link
              href="/ai-recommend"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              AI 推荐
            </Link>
          </nav>

          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/knowledge"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              知识库
            </Link>
            <Link
              href="/ai-recommend"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI 推荐
            </Link>
            <div className="pt-2">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}