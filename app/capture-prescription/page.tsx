"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// CapturePrescription uses react-webcam which requires browser APIs — must be SSR disabled
const CapturePrescription = dynamic(
  () => import("@/components/CapturePrescription/CapturePrescription").then(m => ({ default: m.CapturePrescription })),
  { ssr: false }
);

export default function CapturePrescriptionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <CapturePrescription choosePrescription={() => {}} />;
}
