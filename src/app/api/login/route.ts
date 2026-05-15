import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    const user = await prisma.user.findFirst({
      where: { name, password }
    });

    if (user) {
      return Response.json({ message: 'Login successful', user });
    } else {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}