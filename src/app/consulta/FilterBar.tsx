'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (term: string, key: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(key, term);
        } else {
            params.delete(key);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por Nome</label>
                <input 
                    type="text" 
                    placeholder="Nome..."
                    onChange={(e) => handleSearch(e.target.value, 'name')}
                    defaultValue={searchParams.get('name') || ''}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por Carro (Placa)</label>
                <input 
                    type="text" 
                    placeholder="Ex: ABC1234..."
                    onChange={(e) => handleSearch(e.target.value, 'plate')}
                    defaultValue={searchParams.get('plate') || ''}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
            </div>
            <div className="flex items-end">
                <p className="text-xs text-gray-400 italic pb-2">
                    {isPending ? "Atualizando lista..." : "Filtrando resultados automaticamente"}
                </p>
            </div>
        </div>
    );
}