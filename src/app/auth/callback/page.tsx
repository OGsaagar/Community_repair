import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // Create profile for new OAuth user
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || "",
      avatar_url: user.user_metadata?.avatar_url || null,
      role: "client",
    })
  }

  redirect("/profile/complete")
}
