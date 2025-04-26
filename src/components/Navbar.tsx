"use client";
import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { auth } from '../lib/firebase'; // Import the auth instance

// Add Brain icon component
const Brain = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 0 19.5v-15A2.5 2.5 0 0 1 2.5 2h7Z" />
    <path d="M21.5 2A2.5 2.5 0 0 1 24 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 12 19.5v-15A2.5 2.5 0 0 1 14.5 2h7Z" />
    <path d="M12 8h4" />
    <path d="M12 16h4" />
    <path d="M8 8H4" />
    <path d="M8 16H4" />
  </svg>
);

// Add Button component
const Button = ({
  children,
  className,
  variant,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'outline' | 'default';
  onClick?: () => void;
}) => {
  const baseClasses = "py-2 px-4 rounded-md font-medium transition-colors";
  const variantClasses = variant === 'outline'
    ? "border border-gray-200 bg-transparent hover:border-secondary hover:text-secondary"
    : "bg-primary text-gray-800 hover:bg-primary/90";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-secondary" />
          <span className="text-2xl font-bold text-gray-800">Synapse</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-secondary transition-colors font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-secondary transition-colors font-medium">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-secondary transition-colors font-medium">
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              <Link href="/dashboard">
                <Button className="bg-primary text-gray-800 hover:bg-primary/90 font-medium">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex border-gray-200 hover:border-secondary hover:text-secondary"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-gray-800 hover:bg-primary/90 font-medium">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
