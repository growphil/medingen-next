"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SavedAddress = dynamic(
  () => import("@/components/SavedAddress/SavedAddress").then(m => ({ default: m.SavedAddress })),
  { ssr: false }
);

export default function SavedAddressPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <SavedAddress chooseAddress={() => {}} />;
}
