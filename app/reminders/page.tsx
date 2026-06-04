"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Reminder = dynamic(() => import("@/components/Reminder/Reminder").then(m => ({ default: m.Reminder })), { ssr: false });
export default function RemindersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Reminder />;
}
