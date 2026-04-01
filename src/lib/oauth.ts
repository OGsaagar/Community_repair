import { createClient } from "@/lib/supabase/client"

export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

export async function signInWithGitHub() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUpWithEmail(
  email: string,
  password: string,
  role: "client" | "repairer" | "both"
) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
