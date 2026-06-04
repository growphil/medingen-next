"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OrderConfirmed = dynamic(
  () => import("@/components/OrderConfirmed/OrderConfirmed").then(m => ({ default: m.OrderConfirmed })),
  { ssr: false }
);

export default function OrderConfirmedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <OrderConfirmed />;
}
