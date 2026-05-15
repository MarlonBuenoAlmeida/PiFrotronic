import { prisma } from "./prisma";

export async function isVehicleAvailable(
  vehiclePlate: string,
  startDate: Date,
  endDate: Date,
  excludeId?: string
) {
  const conflict = await prisma.tripRequest.findFirst({
    where: {
      vehiclePlate: vehiclePlate,
      status: 'APPROVED',
      id: excludeId ? { not: excludeId } : undefined,
      AND: [
        {
          departureDate: { lte: endDate },
        },
        {
          returnDate: {
            not: null,
            gte: startDate,
          },
        },
      ],
    },
  });

  return !conflict;
}

export async function getAvailableVehicles(startDate: Date, endDate: Date) {
  const allVehicles = await prisma.vehicle.findMany();
  
  const availableVehicles = await Promise.all(
    allVehicles.map(async (vehicle) => {
      const available = await isVehicleAvailable(vehicle.plate, startDate, endDate);
      return available ? vehicle : null;
    })
  );

  return availableVehicles.filter((v) => v !== null);
}