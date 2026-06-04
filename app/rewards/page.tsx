"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Rewards = dynamic(() => import("@/components/Rewards/Rewards").then(m => ({ default: m.Rewards })), { ssr: false });
export default function RewardsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Rewards />;
}
