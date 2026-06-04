"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OrderPayment = dynamic(
  () => import("@/components/OrderPayment/OrderPayment").then(m => ({ default: m.OrderPayment })),
  { ssr: false }
);

export default function OrderPaymentPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <OrderPayment />;
}
