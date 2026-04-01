import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    }

    getUser();

    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user);
      }
    );

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [supabase]);

  return { user, session, isLoading };
}
