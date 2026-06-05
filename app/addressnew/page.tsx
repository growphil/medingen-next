"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AddressNew = dynamic(() => import("@/components/AddressNew/AddressNew").then(m => ({ default: m.AddressNew })), { ssr: false });

export default function AddressNewPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <AddressNew />;
}
