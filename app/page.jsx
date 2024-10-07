'use client'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [formErrors, setFormErrors] = useState({ title: '', body: '' });
  const userSession = sessionStorage.getItem('user');

  useEffect(() => {
    if (!user && !userSession) {
      router.push('/sign-up');
    }

    // Fetch the blog posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data);
        console.log("data",data)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user, userSession, router]);

  const handleCardClick = (postId) => {
    router.push(`/blog-detail/${postId}`);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = { title: '', body: '' };
    let isValid = true;

    if (!formData.title) {
      errors.title = 'Title is required';
      isValid = false;
    }
    if (!formData.body) {
      errors.body = 'Body is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted:', formData);
      setFormData(
        { 
          title: '',
          body: ''
        }
      )
      setShowModal(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between w-full mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
        </div>
        <div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2" 
            onClick={() => setShowModal(true)} 
          >
            Add Blog
          </button>

          <button 
            className="bg-red-500 text-white px-4 py-2 rounded" 
            onClick={() => {
              signOut(auth);
              sessionStorage.removeItem('user');
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-8 row-start-2 w-full">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => handleCardClick(post.id)} 
            className="card p-4 border cursor-pointer hover:bg-gray-100 flex flex-col justify-between"
            style={{ width: '300px', height: '200px' }} 
          >
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.body.slice(0, 50)}...</p>
          </div>
        ))}
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-2xl mb-4">Add New Blog</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-bold mb-2">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded w-full p-2"
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="body" className="block text-sm font-bold mb-2">Body</label>
                <textarea 
                  id="body" 
                  name="body"
                  value={formData.body}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded w-full p-2"
                />
                {formErrors.body && <p className="text-red-500 text-sm">{formErrors.body}</p>}
              </div>

              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => {
                    setFormData(
                      { title: '', body: '' }
                    )
                    setShowModal(false)
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
