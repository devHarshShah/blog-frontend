'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const [cookieExists, setCookieExists] = useState<boolean | null>(null);

  function hasCookie(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const storedJwtToken = Cookies.get('jwtToken=');
    if (storedJwtToken === '' || !storedJwtToken) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setCookieExists(hasCookie());
  }, []);

  function deleteCookie(event: React.MouseEvent<HTMLButtonElement>): void {
    Cookies.remove('jwtToken=');
    router.push('/');
  }

  return (
    <nav className="text-white p-4 bg-[#0101272d] px-6 border-1 border-[#E25037]">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="text-lg font-bold flex flex-row justify-center items-center w-full md:w-auto">
          <p className="mt-2">I-Blogs</p>
        </div>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 ml-0 md:ml-16 w-full md:w-auto">
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
        <div className="flex space-x-4 items-center w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
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