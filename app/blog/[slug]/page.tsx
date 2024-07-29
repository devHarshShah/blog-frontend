'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function Page({ params }: { params: { slug: string } }) {
  interface Author {
    _id: string;
    name: string;
  }

  interface Blog {
    _id: string;
    title: string;
    content: string;
    author: Author;
    created_at: string;
  }

  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const storedJwtToken = Cookies.get('jwtToken=');
        if (storedJwtToken === '' || !storedJwtToken) {
          router.push('/auth/login');
        }
        const response = await fetch(`http://localhost:8000/api/v1/blog/post?id=${params.slug}`, {
          headers: {
            Authorization: `Bearer ${storedJwtToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        console.log(response);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to load blog post: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log(data);
        setBlog(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.slug]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10">No blog found</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{blog.title}</h1>
        <hr className="mb-6 border-gray-300" />
        <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
        <hr className="mb-6 border-gray-300" />
        <div className="text-sm text-gray-500 flex justify-between items-center">
          <p className="font-medium">
            Author: <span className="text-gray-800">{blog.author?.name}</span>
          </p>
          <p className="font-medium">
            Created At: <span className="text-gray-800">{new Date(blog.created_at).toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
