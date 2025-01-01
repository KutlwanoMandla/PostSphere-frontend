import React, { useState, useEffect } from 'react';
import { Search, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../services/homeService';

interface User {
    id: string;
    name: string;
    bio: string;
}

interface Author {
    id: number;
    username: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    intro: string;
    content: string;
    thumbnailUrl: string;
    createdAt: string;
    likeCount: number;
    comments: any[];
    author: Author;
}

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('recommended');
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);



    if (!user) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://postsphere-backend-1.onrender.com/api/posts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetchAllUsers(token);
                const formattedUsers = response.map((user: any) => ({
                    id: user.id,
                    name: user.username,
                    bio: user.bio,
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchPosts();
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = posts;

        if (selectedFilter === 'most liked') {
            filtered = [...posts].sort((a, b) => b.likeCount - a.likeCount);
        } else if (selectedFilter === 'latest') {
            filtered = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        if (searchQuery) {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.intro.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPosts(filtered);
    }, [posts, selectedFilter, searchQuery]);


    const handleLogOut = () => {
        logout();
        navigate('/');
    };

    const handleCreateBlog = () => {
        navigate('/create');
    };

    const filters = ['recommended', 'most liked', 'latest'];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo Section */}
                        <a href="/home" className="flex-shrink-0 group hover:opacity-90 transition-opacity">
                            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                PostSphere
                            </h1>
                            <p className="text-sm text-gray-600">Share Your Thoughts</p>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>

                            {/* Buttons */}
                            <button
                                onClick={handleCreateBlog}
                                className="flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                aria-label="Create new blog"
                            >
                                <Plus className="h-6 w-6" />
                            </button>

                            <button
                                onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
                            >
                                <img
                                    src={`https://robohash.org/${user.username}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
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

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden block text-gray-700 hover:text-gray-900 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                className="h-8 w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="md:hidden flex flex-col items-start gap-4 py-4 border-t">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button
                                onClick={handleCreateBlog}
                                className="w-full text-left py-2 px-4 text-blue-600 hover:bg-gray-100 rounded-lg"
                            >
                                Create Blog
                            </button>

                            <button
                                onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
                                className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Profile
                            </button>

                            <button
                                onClick={handleLogOut}
                                className="w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100 rounded-lg"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex gap-4 mb-6 overflow-x-auto">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedFilter === filter
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="text-center py-8">Loading posts...</div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="text-center py-8">No posts found</div>
                            ) : (
                                filteredPosts.map((post) => (
                                    <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">

                                        <button
                                            onClick={() => navigate(`/posts/${post.id}`)}
                                            className="block w-full text-left"
                                        >
                                            <div className="md:flex">
                                                {/* Post Thumbnail */}
                                                <div className="md:flex-shrink-0">
                                                    <img
                                                        className="h-48 w-full md:w-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                                        src={`https://postsphere-backend-1.onrender.com${post.thumbnailUrl}`}
                                                        alt={post.title}
                                                    />
                                                </div>

                                                {/* Post Content */}
                                                <div className="p-6 flex flex-col justify-between">
                                                    <div>
                                                        {/* Post Author & Date */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                            <span className="font-medium">{post.author.username}</span>
                                                            <span>•</span>
                                                            <span>{formatDate(post.createdAt)}</span>
                                                        </div>

                                                        {/* Post Title */}
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                            {post.title}
                                                        </h2>

                                                        {/* Post Intro */}
                                                        <p className="text-gray-700 mb-4 line-clamp-2">
                                                            {post.intro}
                                                        </p>
                                                    </div>

                                                    {/* Like & Comments */}
                                                    <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                                        <div className="flex gap-4">
                                                            <span>❤️ {post.likeCount}</span>
                                                            <span>💬 {post.comments.length}</span>
                                                        </div>
                                                        <span className="text-blue-500 hover:underline">
                                                            See more →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </article>


                                ))
                            )}
                        </div>
                    </div>

                    <aside className="md:w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                People You May Know
                            </h2>
                            <div className="space-y-6">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center space-x-4">
                                        <img
                                            className="h-12 w-12 rounded-full object-cover"
                                            src={`https://robohash.org/${user.name}`}
                                            alt={user.name}
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.bio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Home;