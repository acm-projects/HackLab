"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyProjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Replace "project-alpha" with the actual first projectId dynamically if needed
    router.push("/myProject/project-alpha/dashboard");
  }, [router]);

  return <p className="p-6 text-gray-600">Redirecting to your first project...</p>;
}
