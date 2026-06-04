"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Blogs = dynamic(() => import("@/components/Blogs/Blogs").then(m => ({ default: m.Blogs })), { ssr: false });

export default function BlogsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  return <Blogs />;
}
