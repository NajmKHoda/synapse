"use client";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from './ui/button';
import { useAuthStatus } from "@/components/useAuthStatus";
import Link from "next/link";

export function Hero() {
  const { isLoggedIn, loading } = useAuthStatus();
  
  return (
    <section className="bg-gradient-to-br from-[var(--sky-light)] via-white to-[var(--mint-light)] py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/20 px-4 py-2 rounded-full text-sm font-medium text-gray-800">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span>Make learning easier</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Make Learning More Effective with Synapse
          </h1>
          <p className="text-xl text-gray-600">
            Synapse automatically forms student learning pairs based on academic strengths and personality
            compatibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun whitespace-nowrap flex items-center"
                >
                  Dashboard <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun whitespace-nowrap flex items-center"
              >
                Sign Up <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 hover:border-[var(--accent)] hover:text-[var(--accent)] rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-fun animate-float">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 via-transparent to-[var(--accent)]/20 z-10"></div>
          <Image
            src="/images/heroholder.png"
            alt="Students collaborating"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
