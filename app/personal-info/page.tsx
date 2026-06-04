"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PersonalInfo = dynamic(
  () => import("@/components/PersonalInfo/PersonalInfo").then(m => ({ default: m.PersonalInfo })),
  { ssr: false }
);

export default function PersonalInfoPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <PersonalInfo />;
}
