"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Orders = dynamic(() => import("@/components/Orders/Orders").then(m => ({ default: m.Orders })), { ssr: false });
export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Orders />;
}
