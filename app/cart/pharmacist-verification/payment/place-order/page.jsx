"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OrderPlacedSuccess = dynamic(
  () => import("@/components/OrderPlacedSuccess/OrderPlacedSuccess").then(m => m.OrderPlacedSuccess),
  { ssr: false }
);

export default function CartOrderPlacedSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Order Confirmation...
      </div>
    );
  }

  return <OrderPlacedSuccess />;
}
