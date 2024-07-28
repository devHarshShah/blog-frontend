'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.status === 400) {
      alert('Invalid Password');
    } else if(response.ok){
      alert('Login Success');
      router.push('/');
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 ">
      <div className="bg-zinc-800 text-white rounded-lg p-8 shadow-lg border border-[#E25037] w-[40%]">
        <div className="flex flex-col">
          <div className="flex items-center justify-center flex-col p-5 m-5">
            <h1 className="text-3xl text-center font-bold mt-4 mr-2">I-Blogs</h1>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Hello! Welcome Back...</h2>
            <div className="mb-4">
              <label className="block text-zinc-400 mb-2" htmlFor="email">
                Your email address
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="text" id="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-zinc-400 mb-2" htmlFor="password">
                Your Password
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="password" id="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button onClick={handleLogin} className="w-full bg-[#E25037] text-white py-2 rounded-lg hover:bg-[#71281B] transition duration-200">
              Login
            </button>
            <div className="mt-6 text-center">
              <p className="text-zinc-400 mt-2">
                Dont have an account?{' '}
                <Link href="/auth/signup" className="text-blue-400">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
