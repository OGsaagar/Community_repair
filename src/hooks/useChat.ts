import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Message {
  id: string;
  repair_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
}

export function useChat(repairId: string, currentUserId: string) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch existing messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            repair_id,
            sender_id,
            content,
            created_at,
            profiles!messages_sender_id_fkey(full_name, avatar_url)
          `)
          .eq("repair_id", repairId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        // Map the response to the Message interface
        const mappedMessages: Message[] = (data ?? []).map((msg: any) => {
          const senderData = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
          return {
            id: msg.id,
            repair_id: msg.repair_id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            sender: senderData
          };
        });
        
        setMessages(mappedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [repairId]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${repairId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `repair_id=eq.${repairId}`,
        },
        async (payload) => {
        // Fetch the full message with sender info
          const { data } = await supabase
            .from("messages")
            .select(`
              id,
              repair_id,
              sender_id,
              content,
              created_at,
              profiles!messages_sender_id_fkey(full_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            const senderData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
            const mappedMessage: Message = {
              id: data.id,
              repair_id: data.repair_id,
              sender_id: data.sender_id,
              content: data.content,
              created_at: data.created_at,
              sender: senderData || undefined
            };
            setMessages((prev) => [...prev, mappedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [repairId, supabase]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      try {
        setIsSending(true);
        const { error } = await supabase.from("messages").insert({
          repair_id: repairId,
          sender_id: currentUserId,
          content: content.trim(),
        });

        if (error) throw error;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [repairId, currentUserId]
  );

  return { messages, isLoading, isSending, sendMessage };
}
