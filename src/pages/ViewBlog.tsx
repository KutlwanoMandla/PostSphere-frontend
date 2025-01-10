import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThumbsUp, MoreVertical, Plus, LogOut, ChevronLeft, Clock, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        username: string;
    };
}

const ViewBlog = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { postId } = useParams<{ postId: string }>();

    const [article, setArticle] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [menuOpen, setMenuOpen] = useState<{ [key: number]: boolean }>({});

    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'https://postsphere-backend-1.onrender.com/api',
        headers: { Authorization: `Bearer ${token}` },
    });

    // Your existing fetch functions remain the same
    const fetchRelatedPosts = async () => {
        try {
            const response = await api.get('/posts');
            const filteredPosts = response.data.filter(
                (post: any) => post.author.username === article?.author.username && post.id !== article?.id
            );
            setRelatedPosts(filteredPosts);
        } catch (error) {
            console.error('Error fetching related posts:', error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${postId}`);
                setArticle(response.data);
                setComments(response.data.comments || []);
                setLikeCount(response.data.likeCount || 0);
                setIsLiked(false);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        if (article?.author?.username) {
            fetchRelatedPosts();
        }
    }, [article]);

    // Your existing handlers remain the same
    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const formData = new FormData();
            formData.append('username', user?.username || 'Anonymous');
            formData.append('content', newComment);
    
            const response = await fetch(
                `https://postsphere-backend-1.onrender.com/api/posts/${postId}/comments`, 
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );
    
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
    
            const data = await response.json();
            setComments(prev => [...prev, data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!user?.username) return;

        try {
            await api.delete(`/posts/${postId}/comments/${commentId}`, {
                params: { username: user.username }
            });
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setMenuOpen((prev) => ({
                ...prev,
                [commentId]: false
            }));
        } catch (error: any) {
            if (error.response?.status === 403) {
                alert('You are not authorized to delete this comment');
            } else {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment');
            }
        }
    };

    const handleLikeToggle = async () => {
        if (!user?.username) {
            alert('Please log in to like posts');
            return;
        }

        try {
            const formData = new FormData();
        formData.append('username', user.username);

        const response = await fetch(
            `https://postsphere-backend-1.onrender.com/api/posts/${postId}/likes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update like status');
        }

        setIsLiked(prev => !prev);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Error toggling like:', error);

            alert('Failed to update like status');

        }
    };

    const handleLogOut = () => {
        logout();
        navigate('/');
    };

    const handleCreateBlog = () => {
        navigate('/create');
    };

    if (!article) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar remains mostly the same with minor accessibility improvements */}
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
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                                aria-label="View profile"
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
                                aria-label="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Enhanced Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                    aria-label="Go back"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Hero Image */}
                        <div className="relative aspect-video">
                            <img
                                // src={`https://postsphere-backend-1.onrender.com${article.thumbnailUrl}`}
                                src={article.thumbnailUrl}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        <div className="p-8">
                            {/* Meta information */}
                            <div className="flex items-center gap-6 text-gray-600 mb-6">
                                <div className="flex items-center" role="contentinfo">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>By {article.author.username}</span>
                                </div>
                                <div className="flex items-center" role="contentinfo">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <time dateTime={article.createdAt}>
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </time>
                                </div>
                                <div className="flex items-center" role="contentinfo">
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    <span>{likeCount} likes</span>
                                </div>
                            </div>

                            {/* Title and Content */}
                            <h1 className="text-4xl font-bold mb-6" tabIndex={0}>{article.title}</h1>
                            <div
                                className="text-xl text-gray-700 mb-8 font-serif leading-relaxed border-l-4 border-blue-500 pl-6"
                                tabIndex={0}
                            >
                                {article.intro}
                            </div>
                            <div
                                className="prose prose-lg max-w-none mb-8"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                                tabIndex={0}
                            />

                            {/* Like Button */}
                            <div className="flex items-center gap-4 mb-12">
                                <button
                                    onClick={handleLikeToggle}
                                    className={`flex items-center px-6 py-3 ${isLiked ? 'bg-blue-600' : 'bg-blue-500'
                                        } text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    aria-label={isLiked ? 'Unlike this article' : 'Like this article'}
                                >
                                    <ThumbsUp className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                    {isLiked ? 'Liked' : 'Like'}
                                </button>
                            </div>

                            {/* Comments Section */}
                            <section className="border-t pt-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6" />
                                    Comments ({comments.length})
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="w-full p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            aria-label="Add a comment"
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Post Comment
                                        </button>
                                    </div>

                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={`https://robohash.org/${comment.user.username}`}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{comment.user.username}</p>
                                                        <time className="text-sm text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </time>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setMenuOpen({ [comment.id]: !menuOpen[comment.id] })}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        aria-label="Comment options"
                                                    >
                                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                                    </button>
                                                    {menuOpen[comment.id] && (
                                                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg py-1 w-32">
                                                            {user?.username === comment.user.username && (
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-4 text-gray-700">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </article>

                    {/* Enhanced Sidebar */}
                    <aside className="lg:mt-0 mt-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">More from {article.author.username}</h2>
                            <div className="space-y-6">
                                {relatedPosts.length > 0 ? (
                                    relatedPosts.map((relatedPost) => (
                                        <div
                                            key={relatedPost.id}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/posts/${relatedPost.id}`)}
                                        >
                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                                                <img
                                                    // src={`https://postsphere-backend-1.onrender.com${relatedPost.thumbnailUrl}`}
                                                    src={relatedPost.thumbnailUrl}
                                                    alt={relatedPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                                    {relatedPost.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                    {relatedPost.intro}
                                                </p>
                                                <span className="inline-block mt-3 text-blue-500 text-sm group-hover:text-blue-600">
                                                    Read More →
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No other posts from this author.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ViewBlog;