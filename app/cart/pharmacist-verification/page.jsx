"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PharmacistVerification = dynamic(
  () => import("@/components/PharmacistVerification/PharmacistVerification").then(m => m.PharmacistVerification),
  { ssr: false }
);

export default function PharmacistVerificationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Verification...
      </div>
    );
  }

  return <PharmacistVerification />;
}
