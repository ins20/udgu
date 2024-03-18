"use client";

import { Button } from "@/components/ui/button";

import {
  BarChartIcon,
  LogOutIcon,
  UserCheckIcon,
  UserCog,
  UsersIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "react-query";
import api from "@/axios";
import { toast } from "./ui/use-toast";
import { ModeToggle } from "./mode-toggle";
import { AxiosResponse } from "axios";
import { User } from "@/types";

export function Sidebar() {
  const navigate = useNavigate({
    from: "/dashboard",
  });
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");

  const logout = useMutation(() => api.post("v1/auth/logout"), {
    onSuccess: () => {
      navigate({
        to: "/",
      });
      toast({
        description: "Вы вышли из аккаунта",
        title: "Выход",
      });
      localStorage.removeItem("user");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <div className="xl:flex hidden w-[90px] shadow-2xl  dark:bg-[#454545] dark:shadow-neumorphism-dark h-screen">
          <div className="flex flex-col p-6 justify-between">
            <div className="flex flex-col gap-y-8">
              {user?.data.role === "therapist" && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="neumorphism"
                      size="icon"
                      onClick={() => navigate({ to: "/dashboard" })}
                    >
                      {" "}
                      <UserCheckIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Мои пациенты</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {user?.data.is_superuser && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="neumorphism"
                      size="icon"
                      onClick={() => navigate({ to: "/dashboard/users" })}
                    >
                      <UsersIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Пользователи</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="neumorphism"
                    size="icon"
                    onClick={() => navigate({ to: "/dashboard/profile" })}
                  >
                    <UserCog />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Профиль</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="neumorphism"
                    size="icon"
                    onClick={() => navigate({ to: "/dashboard/statistics" })}
                  >
                    <BarChartIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Статистика</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-4">
              <ModeToggle />

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="neumorphism"
                    size="icon"
                    onClick={() => logout.mutate()}
                  >
                    <LogOutIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Выход</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>
      <div className="xl:hidden dark:bg-[#333333] bg-[#EBEFF3] z-50 flex justify-center gap-6 border-t p-2 fixed bottom-0 left-0 right-0">
        {user?.data.role === "therapist" && (
          <Button size={"icon"}>
            <UserCheckIcon
              onClick={() =>
                navigate({
                  to: "/dashboard/",
                })
              }
            />
          </Button>
        )}

        {user?.data.is_superuser && (
          <Button size={"icon"}>
            <UsersIcon
              onClick={() =>
                navigate({
                  to: "/dashboard/users",
                })
              }
            />
          </Button>
        )}
        <Button size={"icon"}>
          <UserCog onClick={() => navigate({ to: "/dashboard/profile" })} />
        </Button>
        <Button size={"icon"}>
          <BarChartIcon
            onClick={() =>
              navigate({
                to: "/dashboard/statistics",
              })
            }
          />
        </Button>
        <Button size={"icon"}>
          <LogOutIcon onClick={() => logout.mutate()} />
        </Button>
      </div>
    </>
  );
}
