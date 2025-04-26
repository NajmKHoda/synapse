"use client";
import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { Brain, Menu, X } from 'lucide-react';
import { auth } from '../lib/firebase'; // Import the auth instance
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      setIsMobileMenuOpen(false); // Close mobile menu after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6" style={{ color: "var(--mint)" }} />
          <span className="text-2xl font-bold text-gray-800">Synapse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-secondary transition-colors font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-secondary transition-colors font-medium">
            How It Works
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                className="inline-flex"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              <Link href="/dashboard">
                <Button className="bg-[var(--primary)] text-gray-800 hover:bg-primary/90 font-medium">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="inline-flex border-gray-200 hover:border-secondary hover:text-secondary"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[var(--primary)] text-gray-800 hover:bg-primary/90 font-medium">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile slide-out menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5">
            <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" style={{ color: "var(--mint)" }} />
              <span className="text-xl font-bold text-gray-800">Synapse</span>
              </div>
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          <nav className="mb-8">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="#features" 
                  className="block py-2 text-gray-700 hover:text-[var(--mint)] text-lg font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="#how-it-works" 
                  className="block py-2 text-gray-700 hover:text-[var(--mint)] text-lg font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="space-y-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[var(--primary)] text-gray-800 hover:bg-primary/90 font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[var(--primary)] text-gray-800 hover:bg-primary/90 font-medium">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:border-secondary hover:text-secondary"
                  >
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
};

export default Navbar;
