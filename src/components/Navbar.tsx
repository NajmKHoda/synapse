"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signOut, getSupabase } from "@/lib/supabase";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { Brain, Menu, X } from "lucide-react";
import Button from "./ui/button";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      try {
        const { data } = await getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null);
      }
    };

    fetchSession();

    // Listen to auth changes
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Block scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setMobileOpen(false);
    router.push('/login');
  };

  const toggleMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-[var(--mint)]" />
          <span className="text-2xl font-bold text-gray-800">Synapse</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="font-medium text-gray-600 hover:text-[var(--secondary)]">
            Features
          </Link>
          <Link href="#how-it-works" className="font-medium text-gray-600 hover:text-[var(--secondary)]">
            How It Works
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button variant="outline" onClick={handleSignOut} className="inline-flex">
                Sign Out
              </Button>
              <Link href="/dashboard">
                <Button className="bg-[var(--primary)] text-gray-800 font-medium hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="inline-flex border-gray-200 hover:border-[var(--secondary)] hover:text-[var(--secondary)]">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[var(--primary)] text-gray-800 font-medium hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={toggleMenu} className="md:hidden p-2 rounded-md" aria-label="Toggle menu">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleMenu}
      />

      {/* Mobile slide-out */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-[var(--mint)]" />
              <span className="text-xl font-bold text-gray-800">Synapse</span>
            </Link>
            <button onClick={toggleMenu} className="p-2 rounded-md" aria-label="Close menu">
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="mb-8 space-y-4">
            <Link href="#features" onClick={() => setMobileOpen(false)} className="block font-medium text-lg text-gray-700 hover:text-[var(--mint)]">
              Features
            </Link>
            <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="block font-medium text-lg text-gray-700 hover:text-[var(--mint)]">
              How It Works
            </Link>
          </nav>

          <div className="space-y-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-[var(--primary)] text-gray-800 font-medium hover:bg-primary/90">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-[var(--primary)] text-gray-800 font-medium hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-gray-200 hover:border-[var(--secondary)] hover:text-[var(--secondary)]">
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
