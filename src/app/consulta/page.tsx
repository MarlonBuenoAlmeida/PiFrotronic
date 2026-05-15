import { prisma } from '../../../lib/prisma';
import TripRequestCard from '../dashboard/TripRequestCard';
import FilterBar from './FilterBar';
import Link from 'next/link';

export default async function ConsultaPage({
    searchParams
}: {
    searchParams: Promise<{ name?: string; plate?: string }>
}) {
    const params = await searchParams;

    const requests = await prisma.tripRequest.findMany({
    where: {
        AND: [
            params.name ? { fullName: { contains: params.name } } : {},
            params.plate ? {
                OR: [
                    { vehiclePlate: { contains: params.plate } }, 
                    { 
                        vehicle: { 
                            model: { contains: params.plate }
                        } 
                    }
                ]
            } : {},
        ]
    },
    include: {
        vehicle: true 
    },
    orderBy: {
        departureDate: 'desc'
    }
});

   
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'APPROVED': return 'Aprovado';
            case 'REJECTED': 
            case 'DENIED':
                return 'Negado';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-black">
            <div className="max-w-5xl mx-auto">
                <div className="mb-4">
                   <Link 
                    href="/" 
                    className="inline-block bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-700 transition shadow-md w-fit no-underline">
                        ← Voltar para Início
                    </Link>
                </div>
                
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Consulta de Agendamentos</h1>
                    <p className="text-gray-500">Visualize e acompanhe todos os pedidos de frota.</p>
                </header>

                <FilterBar />

                <div className="space-y-4 mt-6">
                    {requests.length === 0 ? (
                        <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                            Nenhum agendamento encontrado com esses filtros.
                        </div>
                    ) : (
                        requests.map((req) => (
                            <TripRequestCard 
                                key={req.id} 
                                request={req} 
                                statusLabel={getStatusLabel(req.status)} 
                                readOnly={true}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}