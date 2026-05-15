export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import Footer from "../components/footer";
import TripRequestCard from './TripRequestCard';
import DateRangePicker from './DateRangePicker';



export default async function Dashboard({ 
    
    searchParams 
}: { 
    searchParams: Promise<{ view?: string; from?: string; to?: string }> 
}) {
    const resolvedParams = await searchParams;
    const view = resolvedParams.view || 'pending';
    
    const statusFilter = view === 'approved' ? 'APPROVED' : view === 'denied' ? 'DENIED' : 'PENDING';

    let startDate: Date;
    let endDate: Date;

    if (resolvedParams.from && resolvedParams.to) {
        startDate = new Date(resolvedParams.from);
        endDate = new Date(resolvedParams.to);
        endDate.setHours(23, 59, 59, 999);
    } else {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
    }


    const statusLabels: Record<string, string> = {
        PENDING: 'Pendente',
        APPROVED: 'Aprovado',
        DENIED: 'Negado'
    };

    const whereClause: any = {
    status: statusFilter,
};

if (resolvedParams.from && resolvedParams.to) {
    const startDate = new Date(resolvedParams.from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(resolvedParams.to);
    endDate.setHours(23, 59, 59, 999);

    whereClause.departureDate = {
        gte: startDate,
        lte: endDate
    };
}

const tripRequests = await prisma.tripRequest.findMany({
    where: whereClause,
    include: {
        vehicle: true 
    },
    orderBy: {
        departureDate: "asc"
    }
});

console.log("Status atual:", statusFilter);
console.log("Filtro usado:", JSON.stringify(whereClause, null, 2));
console.log("Pedidos encontrados:", tripRequests.length);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link 
                    href="/" 
                    className="inline-block bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-700 transition shadow-md w-fit no-underline">← Voltar para Início
                    </Link>
                    <Link 
                        href="/frota" 
                        className="inline-block bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-700 transition shadow-md w-fit no-underline">Cadastrar veículos
                        </Link>
                </div>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                    <div className="space-x-2">
                        <Link href="/dashboard?view=pending" className={`px-4 py-2 rounded ${view === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            Pendentes
                        </Link>
                        <Link href="/dashboard?view=approved" className={`px-4 py-2 rounded ${view === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            Aprovados
                        </Link>
                        <Link href="/dashboard?view=denied" className={`px-4 py-2 rounded ${view === 'denied' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            Negados
                        </Link>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Filtrar por Período</h2>
                    <DateRangePicker />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Pedidos {statusLabels[statusFilter]}s
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({startDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')})
                        </span>
                    </h2>
                    
                    {tripRequests.length === 0 ? (
                        <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-black">
                            <p className="text-gray-500">Nenhum pedido encontrado para este período.</p>
                        </div>
                    ) : (
                        tripRequests.map((request) => (
                            <TripRequestCard 
                               key={request.id} 
                               request={request} 
                               statusLabel={statusLabels[request.status] || request.status} 
                            />
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}