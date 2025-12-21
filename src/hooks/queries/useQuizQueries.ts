import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// 퀴즈 생성
export function useCreateQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quizData: any) => {
      const { data, error } = await supabase
        .from("quizzes")
        .insert(quizData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['card', data.card_id] });
    }
  });
}

// 게임 점수 저장
export function useSaveGameScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scoreData: { card_id: string; user_id: string; score: number; [key: string]: any }) => {
      const { data, error } = await supabase
        .from("game_results")
        .insert(scoreData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rankings', data.card_id] });
      queryClient.invalidateQueries({ queryKey: ['userRankings', data.user_id] });
    }
  });
}
