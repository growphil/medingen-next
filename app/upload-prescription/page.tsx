"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const UploadPrescription = dynamic(
  () => import("@/components/UploadPrescription/UploadPrescription").then(m => ({ default: m.UploadPrescription })),
  { ssr: false }
);

export default function UploadPrescriptionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <UploadPrescription choosePrescription={() => {}} />;
}
