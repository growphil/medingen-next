"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Login1 = dynamic(
  () => import("@/components/Login1/Login1").then(m => ({ default: m.Login1 })),
  { ssr: false }
);

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Medingen Pharmacy...
      </div>
    );
  }

  return (
    <Login1 />
  );
}
