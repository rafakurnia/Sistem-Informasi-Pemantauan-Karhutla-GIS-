import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";

export default async function DashboardShell({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = "pelapor";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role || "pelapor";
  }

  return (
    <div className="dashboard-frame">
      <Sidebar role={role} />

      <div className="dashboard-content-column">
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}