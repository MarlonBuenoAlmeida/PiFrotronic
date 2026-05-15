import { prisma } from '../../../lib/prisma';
import TripRequestForm from '../dashboard/TripRequestForm';

export default async function Page({ 
    searchParams 
}: { 
    searchParams: Promise<{ from?: string; to?: string }> 
}) {
    const params = await searchParams;
    
    const allVehicles = await prisma.vehicle.findMany();
    let availableVehicles = allVehicles;

    if (params.from && params.to) {
        const start = new Date(params.from);
        const end = new Date(params.to);

        const busyTrips = await prisma.tripRequest.findMany({
            where: {
                status: 'APPROVED',
                OR: [
                    {
                        AND: [
                            { departureDate: { lte: end } },
                            { returnDate: { gte: start } }
                        ]
                    }
                ]
            },
            select: { vehiclePlate: true }
        });

        const busyPlates = busyTrips.map(t => t.vehiclePlate).filter(Boolean) as string[];
        
        availableVehicles = allVehicles.filter(v => !busyPlates.includes(v.plate));
    }

    return <TripRequestForm vehicles={availableVehicles} />;
}