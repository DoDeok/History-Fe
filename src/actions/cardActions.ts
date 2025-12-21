'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCards(orderBy: 'created_at' | 'title' = 'created_at') {
  const cards = await prisma.card.findMany({
    orderBy: { [orderBy]: 'desc' },
    include: {
      user: {
        select: {
          user_id: true,
        }
      }
    }
  });
  return cards;
}

export async function getCardById(id: string) {
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      flows: {
        orderBy: { node_order: 'asc' }
      },
      quizzes: true,
      user: {
        select: {
          user_id: true,
        }
      }
    }
  });
  return card;
}

export async function getCardsByUserId(userId: string) {
  const cards = await prisma.card.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
  return cards;
}

export async function createCard(data: {
  title: string;
  content: string;
  user_id: string;
  isQuiz?: boolean;
}) {
  const newCard = await prisma.card.create({
    data: {
      title: data.title,
      content: data.content,
      user_id: data.user_id,
      isQuiz: data.isQuiz ?? false,
    }
  });
  revalidatePath('/set');
  return newCard;
}

export async function updateCard(id: string, data: {
  title?: string;
  content?: string;
  isQuiz?: boolean;
}) {
  const updatedCard = await prisma.card.update({
    where: { id },
    data
  });
  revalidatePath('/set');
  revalidatePath(`/set/${id}`);
  return updatedCard;
}

export async function deleteCard(id: string) {
  await prisma.card.delete({
    where: { id }
  });
  revalidatePath('/set');
}
