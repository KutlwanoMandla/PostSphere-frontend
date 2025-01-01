import React, { useEffect, useState } from 'react';
import { Trash2, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface Post {
    id: number;
    title: string;
    intro: string;
    content: string;
    likeCount: number;
    comments: any[];
    author: {
        id: number;
        username: string;
    };
}

interface User {
    username: string;
    email: string;
    bio: string;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    // const { user, logout } = useAuth();

    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const userId = localStorage.getItem("userId");


    useEffect(() => {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
            const response = await fetch('https://postsphere-backend-1.onrender.com/api/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach token here
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json() as Post[];
            console.log(data);
    
            const userPosts = data.filter(post => post.author.id === parseInt(userId || ''));
            console.log(userPosts);
            setPosts(userPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    

    
    const handleDeleteBlog = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://postsphere-backend-1.onrender.com/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
    
            setPosts(posts.filter(post => post.id !== id));
            alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again later.');
        }
    };
    

    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };
    const handleCreateBlog = () => {
        navigate('/create');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <a
                            href="/home"
                            className="flex-shrink-0 group hover:opacity-90 transition-opacity"
                        >
                            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                PostSphere
                            </h1>
                            <p className="text-sm text-gray-600">Share Your Thoughts</p>
                        </a>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleCreateBlog}
                                className="flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                aria-label="Create new blog"
                            >
                                <Plus className="h-6 w-6" />
                            </button>

                            <button
                                onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={`https://robohash.org/${user?.username}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full mx-auto"
                                />
                            </button>

                            <button
                                onClick={handleLogOut}
                                className="flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                aria-label='Logout'
                            >
                                <LogOut className="h-5 w-5" />

                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex items-center space-x-8">
                        <img
                            src={`https://robohash.org/${user?.username}`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-100"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.username}</h1>
                            <p className="text-lg text-gray-600 mb-2">{user?.bio || 'Bio coming soon...'}</p>
                        </div>
                    </div>
                </div>

                {/* Blogs */}
                <div className="space-y-6">
                {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.intro}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <span className="mr-6">❤️ {post.likeCount}</span>
                                            <span>💬 {post.comments.length}</span>
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBlog(post.id)}
                                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                    aria-label="Delete blog"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;