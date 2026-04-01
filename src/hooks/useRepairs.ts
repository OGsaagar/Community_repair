import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useClientRepairs(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["repairs", "client", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select(
          `
          *,
          repairer:profiles!repairs_repairer_id_fkey(full_name, avatar_url, avg_rating),
          bids(count)
        `
        )
        .eq("client_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useRepairerRepairs(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["repairs", "repairer", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useSubmitRepair() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: repair, error } = await supabase
        .from("repairs")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return repair;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    },
  });
}
