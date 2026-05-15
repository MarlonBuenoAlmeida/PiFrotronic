import { prisma } from '../../../lib/prisma';
import { saveVehicle, deleteVehicle } from '../dashboard/vehicles/actions';
import Link from 'next/link';

export default async function FrotaPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { model: 'asc' } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-700 transition shadow-md w-fit no-underline"
          >
            ← Voltar para Início
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">Cadastro de Veículos</h1>

          <form action={saveVehicle} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <input name="plate" placeholder="Placa" className="border p-3 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input name="model" placeholder="Modelo" className="border p-3 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input name="color" placeholder="Cor" className="border p-3 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" className="bg-green-600 text-white font-bold p-3 rounded hover:bg-green-700 transition shadow-md">
              Cadastrar
            </button>
          </form>

          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Veículos Cadastrados</h2>
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div key={v.plate} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition">
                <div className="text-black">
                  <span className="font-bold bg-blue-100 px-2 py-1 rounded text-blue-800 mr-2">{v.plate}</span>
                  <span className="text-lg font-medium">{v.model}</span>
                  {v.color && <span className="text-gray-500 text-sm ml-2">({v.color})</span>}
                </div>
                
                <form action={async () => { 'use server'; await deleteVehicle(v.plate); }}>
                  <button className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition font-medium text-sm">
                    Excluir
                  </button>
                </form>
              </div>
            ))}
            {vehicles.length === 0 && (
              <p className="text-gray-400 text-center py-4">Nenhum veículo cadastrado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}