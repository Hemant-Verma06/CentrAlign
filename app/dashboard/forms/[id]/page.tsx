'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

export default function FormSubmissionsPage() {
    const params = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/forms/${params.id}/submissions`)
            .then((res) => {
                if (res.status === 401) router.push('/login');
                return res.json();
            })
            .then((data) => {
                setSubmissions(data.submissions || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id, router]);

    if (loading) return <div className="p-8 text-center">Loading submissions...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {submissions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No submissions yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {submissions.map((sub) => (
                                        <tr key={sub._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(sub.submittedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <pre className="whitespace-pre-wrap font-sans">
                                                    {JSON.stringify(sub.data, null, 2)}
                                                </pre>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
