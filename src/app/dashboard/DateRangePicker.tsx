'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function DateRangePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [from, setFrom] = useState(searchParams.get('from') || '');
    const [to, setTo] = useState(searchParams.get('to') || '');

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (from) params.set('from', from); else params.delete('from');
        if (to) params.set('to', to); else params.delete('to');
        
        router.push(`?${params.toString()}`);
    };

    const clearFilter = () => {
        setFrom('');
        setTo('');
        router.push('?view=' + (searchParams.get('view') || 'pending'));
    };

    const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFrom(today);
    setTo(today);
};

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Data Inicial
                </label>
                <input 
                    type="date" 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                    Data Final
                </label>
                <input 
                    type="date" 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Filtrar Período
                </button>
                {(from || to) && (
                    <button 
                        onClick={clearFilter}
                        className="text-gray-500 text-sm hover:underline"
                    >
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
}