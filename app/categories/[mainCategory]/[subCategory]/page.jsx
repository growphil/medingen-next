"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CategoryPage = dynamic(
  () => import("@/components/Category/CategoryPage").then(m => m.CategoryPage),
  { ssr: false }
);

export default function SubCategoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Products...
      </div>
    );
  }

  return <CategoryPage />;
}
