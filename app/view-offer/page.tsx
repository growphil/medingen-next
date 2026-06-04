"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OffersView = dynamic(() => import("@/components/OffersView/OffersView").then(m => ({ default: m.OffersView })), { ssr: false });

export default function ViewOfferPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) {
    return (
      <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }
  
  return <OffersView />;
}
