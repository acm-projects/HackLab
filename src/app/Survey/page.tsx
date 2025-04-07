// app/Survey/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SurveyRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Survey/name");
  }, [router]);

  return null;
}
