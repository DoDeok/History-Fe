'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createQuiz(data: {
  user_id: string;
  card_id?: string;
  title: string;
  content: string;
  correct_answer: string;
  score: number;
  options: string[];
  type: string;
}) {
  const newQuiz = await prisma.quiz.create({
    data
  });
  if (data.card_id) {
    revalidatePath(`/set/${data.card_id}`);
  }
  return newQuiz;
}

export async function getQuizzesByCardId(cardId: string) {
  const quizzes = await prisma.quiz.findMany({
    where: { card_id: cardId },
    orderBy: { created_at: 'desc' }
  });
  return quizzes;
}

export async function saveGameRecord(data: {
  user_id: string;
  quiz_id: string;
  card_id: string;
  is_correct: boolean;
  flow?: string;
  order?: number;
  title?: string;
  content?: string;
}) {
  const record = await prisma.gameRecord.create({
    data
  });
  revalidatePath(`/rank/${data.card_id}`);
  return record;
}

export async function getGameRecordsByCardId(cardId: string) {
  const records = await prisma.gameRecord.findMany({
    where: { card_id: cardId },
    include: {
      user: {
        select: {
          user_id: true,
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
  return records;
}

export async function getGameRecordsByUserId(userId: string) {
  const records = await prisma.gameRecord.findMany({
    where: { user_id: userId },
    include: {
      card: {
        select: {
          title: true,
        }
      },
      quiz: {
        select: {
          title: true,
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
  return records;
}
