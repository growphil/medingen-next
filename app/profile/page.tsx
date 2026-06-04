"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ProfileView = dynamic(
  () => import("@/components/ProfileView/ProfileView").then(m => ({ default: m.ProfileView })),
  { ssr: false }
);

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
        Loading Medingen Pharmacy...
      </div>
    );
  }

  return (
    <ProfileView />
  );
}
