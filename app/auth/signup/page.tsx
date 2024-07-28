'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Password does not match');
      return;
    }
    const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });

    if (response.status === 400) {
      alert('User Exists');
    } else if (response.ok) {
      alert('Sign Up Success');
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 ">
      <div className="bg-zinc-800 text-white rounded-lg p-8 shadow-lg border border-[#E25037] w-[40%]">
        <div className="flex flex-col">
          <div className="flex items-center justify-center flex-col p-2 m-2">
            <h1 className="text-3xl text-center font-bold mr-2">I-Blogs</h1>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Hello! Welcome Back...</h2>
            <div className="mb-4">
              <label className="block text-zinc-400 mb-2" htmlFor="email">
                Your Name
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="text" id="email" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-zinc-400 mb-2" htmlFor="email">
                Your email address
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="text" id="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-zinc-400 mb-2" htmlFor="password">
                Your Password
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="password" id="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-zinc-400 mb-2" htmlFor="password">
                Confirm Password
              </label>
              <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                <input className="bg-zinc-800 text-white w-full p-2 outline-none" type="password" id="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button onClick={handleSignUp} className="w-full bg-[#E25037] text-white py-2 rounded-lg hover:bg-[#71281B] transition duration-200">
              Sign Up
            </button>
            <div className="mt-6 text-center">
              <p className="text-zinc-400 mt-2">
                Aldready have an account?{' '}
                <Link href="/auth/login" className="text-blue-400">
                  Login
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
