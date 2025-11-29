'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, ExternalLink, BarChart2, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user) {
                    router.push('/login');
                } else {
                    setUser(data.user);
                    fetchForms();
                }
            });
    }, [router]);

    const fetchForms = async () => {
        try {
            const res = await fetch('/api/forms');
            const data = await res.json();
            setForms(data.forms || []);
        } catch (error) {
            console.error('Failed to fetch forms');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <nav className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                AI Form Generator
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 text-sm hidden sm:block">{user.email}</span>
                            <button
                                onClick={() => {
                                    document.cookie = 'token=; Max-Age=0; path=/;';
                                    router.push('/login');
                                }}
                                className="text-gray-600 hover:text-purple-600 text-sm font-medium transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Your Forms</h2>
                        <p className="text-gray-600 mt-1">AI-powered form generation with context memory</p>
                    </div>
                    <Link
                        href="/dashboard/create"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Create New Form
                    </Link>
                </div>

                {forms.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-16 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-10 h-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h3>
                        <p className="text-gray-500 mb-6">Create your first AI-powered form to get started.</p>
                        <Link
                            href="/dashboard/create"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium"
                        >
                            <Plus size={20} />
                            Create Form
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <div key={form._id} className="bg-white rounded-2xl shadow-sm border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all p-6 group">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition">
                                        {form.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                        {form.description || 'No description'}
                                    </p>
                                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                                        {form.purpose}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/dashboard/forms/${form._id}`}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition"
                                    >
                                        <BarChart2 size={16} />
                                        Submissions
                                    </Link>
                                    <Link
                                        href={`/form/${form._id}`}
                                        target="_blank"
                                        className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 transition"
                                    >
                                        <ExternalLink size={16} />
                                        Public
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
