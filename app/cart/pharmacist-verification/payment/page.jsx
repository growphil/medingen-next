"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PaymentPage = dynamic(
  () => import("@/components/PaymentPage/PaymentPage").then(m => m.PaymentPage),
  { ssr: false }
);

export default function CartPaymentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Payment...
      </div>
    );
  }

  return <PaymentPage />;
}
