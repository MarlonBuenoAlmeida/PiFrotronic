'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveTripRequest } from '../dashboard/actions'; 



export default function TripRequestActions({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        const result = await approveTripRequest(id);
        if (result?.error) {
            alert(result.error);
        }
    };

    const updateStatus = async (action: 'approve' | 'deny') => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch('/api/schedule', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error('Status update failed');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="mt-4 flex gap-2">
            <button
                onClick={() => updateStatus('approve')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
            >
                Aprovar
            </button>
            <button
                onClick={() => updateStatus('deny')}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
            >
                Negar
            </button>
        </div>
    );
}
