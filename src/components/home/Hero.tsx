"use client";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from '@/components/ui/Button';
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
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 gap-2 rounded-xl shadow-fun whitespace-nowrap flex items-center"
              >
                Sign Up <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 hover:border-[var(--accent)] hover:text-[var(--accent)] rounded-xl"
            >
              Demo
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-[500px] mx-auto lg:mx-0 max-w-[600px] w-full">
                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-primary/10 via-secondary/5 to-accent/10 blur-xl"></div>

                {/* First image - Configuration Interface */}
                <div
  className="
    absolute
      top-[5%]
      right-[5%]        /* default small screens */
      md:right-[12%]    /* pull  in on md */
      lg:right-[5%]     /* reset on lg+ */
    w-[60%]
      md:w-[70%]        /* a bit wider on md so it fills more space */
      lg:w-[65%]
    h-auto
    rounded-2xl
    overflow-hidden
    shadow-fun
    animate-float
    z-20
    border-4
    border-white
  "
>
  <Image
    src="/images/generate.png"
    alt="AI-Powered Grouping Interface"
    width={600}
    height={800}
    className="object-cover w-full h-full"
  />
</div>

{/* Second image – Generated Groups */}
<div
  className="
    absolute
      bottom-[5%]
      left-[5%]
      md:left-[12%]
      lg:left-[5%]
    w-[60%]
      md:w-[70%]
      lg:w-[65%]
    h-auto
    rounded-2xl
    overflow-hidden
    shadow-fun
    animate-float
    animation-delay-700
    z-10
    border-4
    border-white
  "
>
  <Image
    src="/images/generated.png"
    alt="Generated Student Groups"
    width={600}
    height={400}
    className="object-cover w-full h-full"
  />
</div>


                {/* Decorative elements */}
                <div className="absolute top-[15%] left-[15%] w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-secondary/20 animate-pulse animation-delay-500"></div>
                <div className="absolute top-[60%] left-[25%] w-8 h-8 rounded-full bg-accent/20 animate-pulse animation-delay-1000"></div>
              </div>
      </div>
    </section>
  );
}

export default Hero;
