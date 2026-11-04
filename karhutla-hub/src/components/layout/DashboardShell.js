import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="dashboard-frame">
      <Sidebar />

      <div className="dashboard-content-column">
        <Navbar />
        <main className="dashboard-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}