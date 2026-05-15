export const dynamic = 'force-dynamic';

import { prisma } from '../../../../lib/prisma';
import Link from 'next/link';
import Footer from "../../components/footer";

export default async function ApprovedDashboard() {
    const tripRequests = await prisma.tripRequest.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Dashboard - Aprovados</h1>
                    <Link href="/dashboard" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Voltar para Pendentes</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg text-black">
                    <h2 className="text-2xl font-semibold mb-4">Pedidos Aprovados</h2>
                    {tripRequests.length === 0 ? (
                        <p className="text-gray-600">Nenhum pedido aprovado encontrado.</p>
                    ) : (
                        <div className="space-y-4">
                            {tripRequests.map((request) => (
                                <div key={request.id} className="border border-gray-300 p-4 rounded-lg text-black">
                                    <h3 className="text-xl font-semibold">{request.fullName}</h3>
                                    <p><strong>Motivo:</strong> {request.reason}</p>
                                    <p><strong>Tipo:</strong> {request.type}</p>
                                    <p><strong>Motoristas:</strong> {request.drivers}</p>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    <p><strong>Criado em:</strong> {new Date(request.createdAt).toLocaleString('pt-BR')}</p>
                                    {request.decisionAt && <p className="text-sm text-gray-500">Decisão em: {new Date(request.decisionAt).toLocaleString('pt-BR')}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}