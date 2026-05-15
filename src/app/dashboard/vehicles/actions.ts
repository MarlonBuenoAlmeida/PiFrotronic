'use server';

import { prisma } from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveVehicle(formData: FormData) {
  const plate = formData.get('plate') as string;
  const model = formData.get('model') as string;
  const color = formData.get('color') as string;
  

  await prisma.vehicle.upsert({
    where: { plate },
    update: { model, color },
    create: { plate, model, color },
  });

  revalidatePath('/vehicles');
}
export async function deleteVehicle(plate: string) {
  await prisma.vehicle.delete({
    where: { plate },
  });
  revalidatePath('/vehicles');
}