"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Login3 = dynamic(() => import("@/components/Login3/Login3").then(m => ({ default: m.Login3 })), { ssr: false });
export default function Login3Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Login3 />;
}
