"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SearchBox = dynamic(
  () => import("@/components/SearchBox/SearchBox").then(m => m.SearchBox),
  { ssr: false }
);

export default function ProductSearchPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Search Box...
      </div>
    );
  }

  return <SearchBox />;
}
