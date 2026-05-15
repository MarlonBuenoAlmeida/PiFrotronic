'use server';

import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function createTripRequest(formData: FormData) {
  try {
    const depDate = formData.get('departureDate') as string;
    const depTime = formData.get('departureTime') as string;
    const retDate = formData.get('returnDate') as string;
    const retTime = formData.get('returnTime') as string;
    const vehiclePlate = (formData.get('vehiclePlate') as string)?.toUpperCase();

    const needsTrailer = formData.get('needsTrailer') === 'true'; 
    const drivers = (formData.get('drivers') as string) || "Não especificado";

    const start = new Date(`${depDate}T${depTime}`);
    const end = new Date(`${retDate}T${retTime}`);

    if (end <= start) {
      return { error: "O horário de retorno deve ser após o horário de saída." };
    }

    const existingConflict = await prisma.tripRequest.findFirst({
  where: {
    vehiclePlate: vehiclePlate,
    status: 'APPROVED',
    AND: [
      {
        departureDate: { lte: end }
      },
      {
        returnDate: {
          not: null, 
          gte: start 
        }
      }
    ]
  }
});

    if (existingConflict) {
      return { 
        error: `Este veículo já está reservado para este período por outro agendamento aprovado.` 
      };
    }

    await prisma.tripRequest.create({
      data: {
        fullName: formData.get('fullName') as string,
        reason: formData.get('reason') as string,
        type: "travel",
        drivers: drivers,
        departureDate: start,
        returnDate: end,
        vehiclePlate: vehiclePlate,
        needsTrailer: needsTrailer,
        status: 'PENDING',
      },
    });

    revalidatePath('/formulario');
    revalidatePath('/dashboard');
    revalidatePath('/consulta');

  } catch (e: any) {
    if (e?.message === 'NEXT_REDIRECT') throw e;

    console.error("Erro ao salvar:", e);
    return { error: "Erro ao salvar no banco de dados. Verifique os campos." };
  }

  redirect('/consulta');
}

export async function approveTripRequest(id: string) {
  try {
    const tripToApprove = await prisma.tripRequest.findUnique({
      where: { id },
    });

    if (!tripToApprove || !tripToApprove.returnDate) {
      return { error: "Pedido incompleto ou sem data de retorno." };
    }

    const conflict = await prisma.tripRequest.findFirst({
      where: {
        id: { not: id },
        vehiclePlate: tripToApprove.vehiclePlate,
        status: 'APPROVED',
        AND: [
          { departureDate: { lte: tripToApprove.returnDate } },
          { returnDate: { gte: tripToApprove.departureDate } }
        ]
      }
    });

    if (conflict) {
      return { 
        error: `Conflito! O veículo ${tripToApprove.vehiclePlate} já está ocupado.` 
      };
    }

    await prisma.tripRequest.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        decisionAt: new Date()
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/consulta');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Erro ao aprovar." };
  }
}

export async function deleteTripRequest(id: string) {
  try {
    await prisma.tripRequest.delete({
      where: { id }
    });
    revalidatePath('/dashboard');
    revalidatePath('/consulta');
    return { success: true };
  } catch (e) {
    console.error("Erro ao excluir:", e);
    return { error: "Erro ao excluir o agendamento." };
  }
}