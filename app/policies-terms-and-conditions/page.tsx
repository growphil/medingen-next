"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PolicyPages = dynamic(() => import("@/components/PolicyPages/PolicyPages").then(m => ({ default: m.PolicyPages })), { ssr: false });

export default function TermsAndConditionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  return <PolicyPages policy="terms_and_conditions" />;
}
