import { LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateBlog = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleBodyChange = (content: string) => {
        setPostData((prev) => ({
            ...prev,
            body: content,
        }));
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['link', 'blockquote', 'code-block'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            // ['image', 'video']
        ],
    };



    if (!user) {
        return <Navigate to="/" replace />;
    }

    const [postData, setPostData] = useState<{
        title: string;
        introduction: string;
        body: string;
        thumbnail: File | null;
    }>({
        title: '',
        introduction: '',
        body: '',
        thumbnail: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPostData((prev) => ({ ...prev, thumbnail: file }));
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // console.log(localStorage.getItem("user"))
    let username;
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        let userId;

        try {
            const userString = localStorage.getItem("user");
            if (userString != null) {
                const user = JSON.parse(userString);
                userId = user.id;
                username = user.username;
            } else {
                console.warn("No user data found in localStorage.");
            }


            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('intro', postData.introduction);
            formData.append('content', postData.body);
            formData.append('authorId', userId);

            if (postData.thumbnail) {
                formData.append('thumbnail', postData.thumbnail);
            }


            const response = await fetch('https://postsphere-backend-1.onrender.com/api/posts/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log('Post created successfully:', result);
            navigate('/home');
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <a href="/home" className="flex-shrink-0 group hover:opacity-90 transition-opacity">
                            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                PostSphere
                            </h1>
                            <p className="text-sm text-gray-600">Share Your Thoughts</p>
                        </a>
                        <div className="flex items-center gap-6">
                            <button onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)} className="focus:outline-none">
                                <img
                                    src={`https://robohash.org/${user.username}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full mx-auto"
                                />
                            </button>

                            <button
                                onClick={logout}
                                className="flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                aria-label='Logout'
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Write Article</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Article Thumbnail
                        </label>
                        <div className="relative">
                            {thumbnailPreview ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnailPreview(null);
                                            setPostData((prev) => ({ ...prev, thumbnail: null }));
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                    <div className="flex flex-col items-center">
                                        <p className="mt-2 text-sm text-gray-600">
                                            Click or drag to upload thumbnail
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={postData.title}
                            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your article title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">
                            Introduction
                        </label>
                        <textarea
                            id="introduction"
                            value={postData.introduction}
                            onChange={(e) => setPostData({ ...postData, introduction: e.target.value })}
                            rows={3}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write a brief introduction to your article"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                            Article Body
                        </label>
                        <div className="prose max-w-none">
                            <ReactQuill
                                value={postData.body}
                                onChange={handleBodyChange}
                                modules={modules}
                                className="min-h-[200px] border rounded-lg p-4"
                            />                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Article'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateBlog;