import api from "@/axios";
import { Sidebar } from "@/components/sidebar";

import { Patient } from "@/types";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AxiosResponse } from "axios";

import { useQuery } from "react-query";

export const Route = createFileRoute("/dashboard")({
  component: () => {



    useQuery<AxiosResponse<Patient[]>>("all_patients", () =>
      api.get("v1/patient/get_all", {
        params: {
          limit: 6000,
        },
      })
    );

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
  },
});
