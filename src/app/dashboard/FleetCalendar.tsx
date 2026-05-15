'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

export default function FleetCalendar({ requests }: { requests: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className="space-x-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 border rounded-lg">←</button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 border rounded-lg">→</button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map(day => {
                    const dayRequests = requests.filter(r => isSameDay(new Date(r.date), day));
                    return (
                        <button
                            key={day.toString()}
                            onClick={() => setSelectedDay(day)}
                            className={`h-24 border rounded-xl p-2 transition-all flex flex-col items-start hover:bg-blue-50 ${
                                isSameDay(day, new Date()) ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                            }`}
                        >
                            <span className="text-sm font-semibold">{format(day, 'd')}</span>
                            {dayRequests.length > 0 && (
                                <div className="mt-1 w-full">
                                    <div className="text-[10px] bg-blue-600 text-white px-1 rounded mb-1 truncate">
                                        {dayRequests.length} Viagem(ns)
                                    </div>
                                    {dayRequests.slice(0, 2).map(r => (
                                        <div key={r.id} className="text-[9px] text-gray-600 truncate">• {r.vehiclePlate}</div>
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedDay && (
                <DayDetailsModal 
                    day={selectedDay} 
                    requests={requests.filter(r => isSameDay(new Date(r.date), selectedDay))}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </div>
    );
}

function DayDetailsModal({ 
    day, 
    requests, 
    onClose 
}: { 
    day: Date; 
    requests: any[]; 
    onClose: () => void 
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-blue-600 p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                        {format(day, "dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto text-black">
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                        Veículos Agendados ({requests.length})
                    </h4>

                    {requests.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Nenhum agendamento para este dia.</p>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="border-l-4 border-blue-500 bg-slate-50 p-3 rounded-r-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-blue-900">{req.vehiclePlate}</p>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                            {req.departureTime} - {req.returnTime || '--:--'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1"><span className="font-medium text-black">Motorista:</span> {req.drivers}</p>
                                    <p className="text-xs text-gray-500 mt-1 italic">"{req.reason}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
