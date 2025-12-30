import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
};

