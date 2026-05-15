import { prisma } from '../../../lib/prisma';
import { saveVehicle, deleteVehicle } from '../dashboard/vehicles/actions';

export default async function VehicleManager() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { model: 'asc' } });

  return (
    <section className="mt-12 w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Cadastro de Veículos</h2>
      
      <form action={saveVehicle} className="flex flex-wrap gap-3 mb-6 justify-center">
        <input name="plate" placeholder="Placa" className="border p-2 rounded w-32 text-black" required />
        <input name="model" placeholder="Modelo" className="border p-2 rounded w-48 text-black" required />
        <input name="color" placeholder="Cor" className="border p-2 rounded w-32 text-black" />
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Cadastrar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vehicles.map((v) => (
          <div key={v.plate} className="flex justify-between items-center p-3 border rounded bg-gray-50">
            <div className="text-black">
              <span className="font-bold">{v.plate}</span> - {v.model} ({v.color})
            </div>
            <form action={async () => { 'use server'; await deleteVehicle(v.plate); }}>
              <button className="text-red-500 hover:text-red-700 text-sm font-semibold">Excluir</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}