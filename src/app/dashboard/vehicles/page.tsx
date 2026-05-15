import { prisma } from '../../../../lib/prisma';
import { saveVehicle, deleteVehicle } from './actions';

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { model: 'asc' } });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Frota</h1>

      <form action={saveVehicle} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-3 gap-4">
        <input name="plate" placeholder="Placa (ABC-1234)" className="border p-2 rounded text-black" required />
        <input name="model" placeholder="Modelo (Ex: Gol)" className="border p-2 rounded text-black" required />
        <input name="color" placeholder="Cor" className="border p-2 rounded text-black" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-3 hover:bg-blue-700">
          Salvar Veículo
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-4">Placa</th>
              <th className="p-4">Modelo</th>
              <th className="p-4">Cor</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {vehicles.map((v) => (
              <tr key={v.plate} className="border-t">
                <td className="p-4">{v.plate}</td>
                <td className="p-4">{v.model}</td>
                <td className="p-4">{v.color}</td>
                <td className="p-4 text-right">
                  <form action={async () => { 'use server'; await deleteVehicle(v.plate); }}>
                    <button className="text-red-600 hover:underline">Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}