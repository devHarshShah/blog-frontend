'use client';
import MyBlogs from '../components/MyBlogs';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AddBlog from '../components/AddBlog';

const dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const storedJwtToken = Cookies.get('jwtToken=');
    if (storedJwtToken === '' || !storedJwtToken) {
      router.push('/auth/login');
    }
  }, []);

  return (
    <>
      <Navbar />
      <MyBlogs />
      <AddBlog/>
      <Footer />
    </>
  );
};

export default dashboard;
