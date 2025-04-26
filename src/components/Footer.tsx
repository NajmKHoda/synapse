import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 border-t" style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Brief */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6" style={{ color: "var(--mint)" }} />
              <span className="text-xl font-bold">Synapse</span>
            </div>
            <p className="opacity-80">Intelligent student pairing for better learning outcomes.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/signup" 
                  className="transition-colors hover:underline flex items-center gap-1"
                  style={{ color: "var(--sky)" }}
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="transition-colors hover:underline flex items-center gap-1"
                  style={{ color: "var(--sky)" }}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="opacity-80 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-xl w-full focus:outline-none border"
                style={{ borderColor: "var(--border)" }}
              />
              <button 
                className="px-4 py-2 rounded-r-xl font-medium"
                style={{ 
                  backgroundColor: "var(--sunny)",
                  color: "var(--primary-foreground)"
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center opacity-70" style={{ borderColor: "var(--border)" }}>
          <p>© {new Date().getFullYear()} Synapse Education. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
