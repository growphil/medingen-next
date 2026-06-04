"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SelectPrescription = dynamic(
  () => import("@/components/SelectPrescription/SelectPrescription").then(m => ({ default: m.SelectPrescription })),
  { ssr: false }
);

export default function SelectPrescriptionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <SelectPrescription choosePrescription={() => {}} />;
}
