"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Notifications = dynamic(() => import("@/components/Notifications/Notifications").then(m => ({ default: m.Notifications })), { ssr: false });
export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Notifications />;
}
