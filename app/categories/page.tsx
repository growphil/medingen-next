"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AllCategories = dynamic(
  () => import("@/components/Category/AllCategories").then(m => m.AllCategories),
  { ssr: false }
);

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Categories...
      </div>
    );
  }

  return <AllCategories />;
}
