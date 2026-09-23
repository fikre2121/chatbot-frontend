"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.push(user ? "/chat" : "/login");
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">Loading...</div>
  );
}
