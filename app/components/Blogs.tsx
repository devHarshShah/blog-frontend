"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Corrected import
import Link from 'next/link';

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

const Blogs: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authorsInitialized, setAuthorsInitialized] = useState<boolean>(false); // Track if authors list has been initialized

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const storedJwtToken = Cookies.get('jwtToken=');
        if (storedJwtToken === '' || !storedJwtToken) {
          router.push('/auth/login');
        }
        
        let url = 'http://localhost:8000/api/v1/blog/posts';
        if (selectedAuthor && selectedAuthor !== '') {
          url += `?author=${selectedAuthor}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${storedJwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Loading');
        }
        const data = await response.json();
        setBlogs(data);

        // Only update authors list if it hasn't been initialized yet
        if (!authorsInitialized) {
          const uniqueAuthors = Array.from(new Set(data.map((blog: Blog) => blog.author._id))).map((id) => data.find((blog: Blog) => blog.author._id === id)?.author);
          setAuthors(uniqueAuthors);
          setAuthorsInitialized(true); // Mark authors list as initialized
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedAuthor, authorsInitialized]);

  
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
    <div className="container w-[80%] mx-auto p-4 h-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Blogs</h1>
      <div className="mb-4">
        <label htmlFor="author" className="block text-lg font-medium text-white mb-2">
          Sort by Author:
        </label>
        <select id="author" value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} className="block text-black w-full md:w-[12%] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author?._id} value={author?._id}>
              {author?.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <li key={blog._id} className="bg-white shadow-md rounded-lg p-6 relative h-auto md:h-[50vh]">
            <h2 className="text-2xl font-semibold mb-2 text-black">{blog.title}</h2>
            <p className="text-gray-700 mb-2">{truncateText(blog.content, 300)}</p>
            <div className="text-sm text-gray-500 mb-6">
              <p>Author: {blog.author.name}</p>
              <p>Created At: {new Date(blog.created_at).toLocaleString()}</p>
            </div>
            <div className="flex flex-row space-x-2 w-full absolute bottom-0 py-2 mt-2">
              <Link href={`/blog/${blog._id}`}>
                <button className="px-2 py-1 bg-blue-600 rounded-lg mb-2">Read More</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
