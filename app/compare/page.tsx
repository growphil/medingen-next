"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CompareView = dynamic(
  () => import("@/components/CompareView/CompareView").then(m => ({ default: m.CompareView })),
  { ssr: false }
);

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <CompareView state={null} />;
}
