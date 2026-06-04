"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("@/components/LandingPage/LandingPage").then(m => ({ default: m.LandingPage })), { ssr: false });

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  const showInstall = () => {};

  return <LandingPage showInstall={showInstall} />;
}
