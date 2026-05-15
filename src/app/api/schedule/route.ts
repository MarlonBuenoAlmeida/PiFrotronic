import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
    try {
        const {
            p1: fullName,
            p2: reason,
            p3: type,
            p4: drivers,
            data_nascimento: dateStr,
            hora_ida: departureTime,
            hora_volta: returnTime,
            p7: needsTrailerStr
        } = await request.json();

        const date = new Date(`${dateStr}T00:00:00`);
        const needsTrailer = needsTrailerStr === 'sim';

        const tripRequest = await prisma.tripRequest.create({
            data: {
                fullName,
                reason,
                type,
                drivers,
                date,
                departureTime,
                returnTime,
                needsTrailer,
                status: 'PENDING'
            }
        });

        return Response.json({ message: 'Trip request submitted successfully', tripRequest });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Error submitting trip request' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, action } = await request.json();

        if (!id || !['approve', 'deny'].includes(action)) {
            return Response.json({ message: 'Invalid payload' }, { status: 400 });
        }

        const status = action === 'approve' ? 'APPROVED' : 'DENIED';

        const tripRequest = await prisma.tripRequest.update({
            where: { id },
            data: {
                status,
                decisionAt: new Date()
            }
        });

        return Response.json({ message: `Trip request ${status.toLowerCase()}`, tripRequest });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Error updating trip request' }, { status: 500 });
    }
}