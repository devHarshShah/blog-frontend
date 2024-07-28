'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation'
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const [cookieExists, setCookieExists] = useState<boolean | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);

  // Event handler to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDropdown1 = () => setIsDropdownOpen1(!isDropdownOpen1);

  function hasCookie(cookieName: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return document.cookie
      .split(';')
      .map((entry) => entry.split('='))
      .some(([name, value]) => name.trim() === cookieName && !!value);
  }

  function deleteCookie(event: React.MouseEvent<HTMLButtonElement>): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  }

  return (
    <nav className="text-white p-4 bg-[#0101272d] px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex flex-row justify-center items-center">
          <p className="mt-2">I-Blogs</p>
        </div>
        <ul className="flex space-x-4 ml-16">
          {/* Public links */}
          <li>
            <Link href="/" className="hover:text-zinc-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-zinc-400">
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="flex space-x-4 items-center">
          {cookieExists ? (
            <button onClick={deleteCookie} className="bg-[#E25037] text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : (
            <Link href="/auth/login" className="bg-[#E25037] text-white px-4 py-2 rounded-lg">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
