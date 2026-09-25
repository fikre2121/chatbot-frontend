"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/chat");
    }
  }, [user, loading, router]);

  // Show spinner while checking authentication
  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          role="status"
          aria-label="Loading"
        />
      </main>
    );
  }

  // If authenticated, wait for the redirect
  if (user) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          role="status"
          aria-label="Redirecting"
        />
      </main>
    );
  }

  // Landing page for unauthenticated users
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-bold">
          AI Chatbot
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
          Your AI-powered assistant
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Chat smarter.
          <br />
          Work faster.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Experience a smarter way to interact with AI. Get answers, explore
          ideas, and accomplish more with your personal AI assistant.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        © 2026 AI Chatbot. All rights reserved.
      </footer>
    </main>
  );
}
