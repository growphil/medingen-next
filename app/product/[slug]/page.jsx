"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SearchViewMedicine = dynamic(
  () => import("@/components/SearchViewMedicine/SearchViewMedicine").then(m => m.default),
  { ssr: false }
);

export default function ProductDetailsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Medicine Details...
      </div>
    );
  }

  return <SearchViewMedicine />;
}
