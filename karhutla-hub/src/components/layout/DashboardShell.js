import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="dashboard-frame">
      <Sidebar />

      <div className="dashboard-content-column">
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}