"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ExistingUser = dynamic(() => import("@/components/ExistingUser/ExistingUser").then(m => ({ default: m.ExistingUser })), { ssr: false });
export default function ExistingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <ExistingUser />;
}
