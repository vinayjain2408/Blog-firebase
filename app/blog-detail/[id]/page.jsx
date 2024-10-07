'use client'; 

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const DetailBlog = () => { 
  const { id } = useParams(); 
  console.log('id', id);
  console.log('id',id)
  const [post, setPost] = useState(null);
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4">{post.body}</p>
    </div>
  );
};

export default DetailBlog;
