'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createFlow(data: {
  card_id: string;
  flow: string;
  node_order: number;
  title: string;
  content: string;
  date: string;
  cause: string;
  result: string;
  people: string[];
  significance: string;
}) {
  const newFlow = await prisma.flow.create({
    data
  });
  revalidatePath(`/set/${data.card_id}`);
  return newFlow;
}

export async function getFlowsByCardId(cardId: string) {
  const flows = await prisma.flow.findMany({
    where: { card_id: cardId },
    orderBy: { node_order: 'asc' }
  });
  return flows;
}

export async function updateFlow(id: string, data: {
  flow?: string;
  node_order?: number;
  title?: string;
  content?: string;
  date?: string;
  cause?: string;
  result?: string;
  people?: string[];
  significance?: string;
}) {
  const updatedFlow = await prisma.flow.update({
    where: { id },
    data
  });
  return updatedFlow;
}

export async function deleteFlow(id: string, cardId: string) {
  await prisma.flow.delete({
    where: { id }
  });
  revalidatePath(`/set/${cardId}`);
}
