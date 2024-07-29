'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const MyBlogs: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const storedJwtToken = Cookies.get('jwtToken=');
        if (storedJwtToken === '' || !storedJwtToken) {
          router.push('/auth/login');
        }
        const url = 'http://localhost:8000/api/v1/blog/myposts';
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${storedJwtToken}`,
            'Content-Type': 'text',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(data);

        // Extract unique authors from the fetched blogs
        const uniqueAuthors = Array.from(new Set(data.map((blog: Blog) => blog.author._id))).map((id) => data.find((blog: Blog) => blog.author._id === id)?.author);
        setAuthors(uniqueAuthors);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    const storedJwtToken = Cookies.get('jwtToken=');
    if (storedJwtToken === '' || !storedJwtToken) {
      router.push('/auth/login');
    }
    console.log(id);
    const response = await fetch(`http://localhost:8000/api/v1/blog/post?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${storedJwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete blog');
    }
    alert('Blog deleted successfully');
    router.refresh();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container w-[80%] mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">My Blogs</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <li key={blog._id} className="bg-white shadow-md rounded-lg p-6 relative h-[50vh]">
            <h2 className="text-2xl font-semibold mb-2 text-black">{blog.title}</h2>
            <p className="text-gray-700 mb-2">{truncateText(blog.content, 300)}</p>
            <div className="text-sm text-gray-500 mb-6">
              <p>Author: {blog.author.name}</p>
              <p>Created At: {new Date(blog.created_at).toLocaleString()}</p>
            </div>
            <div className="flex flex-row space-x-2 w-full absolute bottom-0 py-2">
              <Link href={`/blog/${blog._id}`}>
                <button className="px-2 py-1 bg-blue-600 rounded-lg mt-6 mb-2">Read More</button>
              </Link>
              <button onClick={(e) => (handleDelete(blog._id))} className="px-2 py-1 bg-red-600 rounded-lg mt-6 mb-2">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBlogs;
