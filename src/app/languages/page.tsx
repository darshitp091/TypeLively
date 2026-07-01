// src/app/languages/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectLanguagesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/practice");
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: 'var(--font-heading)' }}>
      <h3>Redirecting to Practice Sandbox... 🌐</h3>
    </div>
  );
}
