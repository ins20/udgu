import { Sidebar } from "@/components/sidebar";

import { Outlet, createFileRoute } from "@tanstack/react-router";


const Dashboard = () => {
  return (
    <div className="bg-[#EBEFF3] dark:bg-[#454545]">
      <div className="flex xl:flex-row xl:h-full xl:gap-10 flex-col gap-3 h-full">
        <Sidebar />
        <div className="p-6 w-full min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});
