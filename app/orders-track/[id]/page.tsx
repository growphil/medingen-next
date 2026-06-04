"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// OrdersTrack uses useParams which needs a router context with a route
// We render it inside a BrowserRouter with a route matching /orders-track/:id
const OrderTrack = dynamic(
  () => import("@/components/OrdersTrack/OrdersTrack"),
  { ssr: false }
);

export default function OrdersTrackPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <OrderTrack />;
}
