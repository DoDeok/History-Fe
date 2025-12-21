import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// 특정 카드의 랭킹 조회
export function useRankings(cardId: string) {
  return useQuery({
    queryKey: ['rankings', cardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_results")
        .select("*")
        .eq("card_id", cardId)
        .order("score", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!cardId,
  });
}

// 사용자별 랭킹 조회
export function useUserRankings(userId: string) {
  return useQuery({
    queryKey: ['userRankings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
