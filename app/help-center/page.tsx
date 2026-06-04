"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HelpCenter = dynamic(() => import("@/components/LandingPage/LandingPage").then(m => ({ default: m.HelpCenter })), { ssr: false });

export default function HelpCenterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  return <HelpCenter />;
}
