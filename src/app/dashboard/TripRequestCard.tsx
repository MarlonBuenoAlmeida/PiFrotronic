'use client';

import { useState } from 'react';
import TripRequestActions from './TripRequestActions';
import { Maximize2, X, Calendar, Trash2 } from 'lucide-react'; 
import { deleteTripRequest } from '../dashboard/actions';

export default function TripRequestCard({ 
    request, 
    statusLabel, 
    readOnly = false 
}: { 
    request: any, 
    statusLabel: string, 
    readOnly?: boolean 
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-600 text-white';
            case 'REJECTED':
            case 'DENIED':   return 'bg-red-600 text-white';
            case 'PENDING':  return 'bg-blue-600 text-white';
            default:         return 'bg-gray-500 text-white';
        }
    };

    const formatDateTime = (date: Date | string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center text-black">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-800">{request.fullName}</h3>
                    
                    <p className="text-sm font-semibold text-gray-500">
                        {request.vehicle?.model || 'Modelo não definido'} — {request.vehiclePlate}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm mt-1">
                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-wider ${getStatusStyles(request.status)}`}>
                            {statusLabel}
                        </span>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar size={14} className="text-green-600" />
                            <span className="font-medium">{formatDateTime(request.departureDate)}</span>
                            <Calendar size={14} className="text-red-400" />
                            <span className="font-medium">{formatDateTime(request.returnDate)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!readOnly && request.status === 'PENDING' && <TripRequestActions id={request.id} />}
                    
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                        title="Ver Detalhes"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-black">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-gray-800">Detalhes do Pedido</h2>
                            <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Solicitante</p>
                                    <p className="font-medium">{request.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Status</p>
                                    <p className={`inline-block px-2 py-0.5 rounded font-bold text-xs uppercase mt-1 ${getStatusStyles(request.status)}`}>
                                        {statusLabel}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Motivo</p>
                                    <p className="bg-gray-50 p-3 rounded border mt-1">{request.reason}</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div><p className="text-xs text-blue-800 uppercase font-bold">Saída Real</p><p className="font-semibold">{formatDateTime(request.departureDate)}</p></div>
                                    <div><p className="text-xs text-blue-800 uppercase font-bold">Volta Prevista</p><p className="font-semibold">{formatDateTime(request.returnDate)}</p></div>
                                </div>
                                <div><p className="text-xs text-gray-400 uppercase font-bold">Modelo</p><p className="font-medium">{request.vehicle?.model || 'Não definido'}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase font-bold">Placa</p><p className="font-medium font-mono">{request.vehiclePlate}</p></div>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Motoristas</p>
                                <p className="bg-gray-50 p-2 rounded border italic">{request.drivers}</p>
                            </div>
                        </div>

                        <div className={`p-6 border-t bg-gray-50 flex ${readOnly ? 'justify-end' : 'justify-between'} items-center`}>
                            {!readOnly && (
                                <button 
                                    onClick={async () => {
                                        if (confirm("Tem certeza que deseja excluir permanentemente?")) {
                                            const result = await deleteTripRequest(request.id);
                                            if (result.success) setIsExpanded(false);
                                            else alert(result.error);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm shadow-sm"
                                >
                                    <Trash2 size={18} /> Excluir Pedido
                                </button>
                            )}

                            <button 
                                onClick={() => setIsExpanded(false)}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-bold shadow-md"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}