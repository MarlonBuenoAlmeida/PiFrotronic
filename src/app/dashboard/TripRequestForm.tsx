'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createTripRequest } from '../dashboard/actions';
import Link from 'next/link';

export default function TripRequestForm({ vehicles }: { vehicles: any[] }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const handleDateChange = () => {
        const form = document.querySelector('form') as HTMLFormElement;
        const formData = new FormData(form);
        
        const depDate = formData.get('departureDate') as string;
        const depTime = formData.get('departureTime') as string;
        const retDate = formData.get('returnDate') as string;
        const retTime = formData.get('returnTime') as string;

        if (depDate && depTime && retDate && retTime) {
            const start = `${depDate}T${depTime}`;
            const end = `${retDate}T${retTime}`;
            router.push(`${pathname}?from=${start}&to=${end}`, { scroll: false });
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
            
            <form 
                action={async (data) => {
                    setLoading(true);
                    const result = await createTripRequest(data);
                    if (result?.error) {
                        setMessage(result.error);
                    } else {
                        setMessage("Pedido realizado com sucesso!");
                        (document.querySelector('form') as HTMLFormElement).reset();
                        router.push(pathname);
                    }
                    setLoading(false);
                }} 
                className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6 text-gray-800 border border-gray-100"
            >
                <div>
            <Link 
                href="/" 
                className="inline-block bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-700 transition shadow-md w-fit no-underline"
            >
                ← Voltar para Início
            </Link>
            </div>
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Novo Agendamento de Frota</h2>

                {message && (
                    <div className={`p-4 rounded-lg font-medium ${message.includes('sucesso') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Solicitante</label>
                        <input name="fullName" required className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase text-gray-500">Saída</label>
                            <input type="date" name="departureDate" onBlur={handleDateChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white" required />
                            <input type="time" name="departureTime" onBlur={handleDateChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white" required />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase text-gray-500">Retorno Previsto</label>
                            <input type="date" name="returnDate" onBlur={handleDateChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white" required />
                            <input type="time" name="returnTime" onBlur={handleDateChange} className="w-full border border-gray-300 p-2 rounded-lg bg-white" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Veículo</label>
                        <select name="vehiclePlate" required className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="">{vehicles.length === 0 ? "Escolha as datas para ver os carros livres" : "Selecione um carro..."}</option>
                            {vehicles.map(v => (
                                <option key={v.plate} value={v.plate}>{v.model} - {v.plate}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Precisa de Carretinha?</label>
                            <select 
                                name="needsTrailer" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="false">Não ❌</option>
                                <option value="true">Sim ✅</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Motorista(s)</label>
                            <input 
                                name="drivers" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo</label>
                        <textarea name="reason" required className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-[0.99] disabled:bg-gray-400"
                >
                    {loading ? 'Verificando...' : 'Confirmar Agendamento'}
                </button>
            </form>
        </div>
    );
}