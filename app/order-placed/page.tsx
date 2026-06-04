"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OrderPlacedSuccess = dynamic(
  () => import("@/components/OrderPlacedSuccess/OrderPlacedSuccess").then(m => ({ default: m.OrderPlacedSuccess })),
  { ssr: false }
);

export default function OrderPlacedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <OrderPlacedSuccess />;
}
