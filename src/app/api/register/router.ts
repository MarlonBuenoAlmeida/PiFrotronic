import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
    try {
        const { name, password, description } = await request.json();

        const user = await prisma.user.create({
            data: { name, password, description }
        });

        return Response.json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Error creating user' }, { status: 500 });
    }
}