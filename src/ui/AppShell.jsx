import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <TopBar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}