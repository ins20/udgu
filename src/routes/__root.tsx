import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "react-query";
import api from "../axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
const Root = () => {
  const { toast } = useToast();
  const navigate = useNavigate({ from: "/" });
  const user = useQuery("user", () => api.get("users/me"), {
    onSuccess: () => {
      navigate({
        to: "/dashboard",
      });
    },
    onError: () => {
      navigate({ to: "/" });
      toast({
        title: "Войдите в систему",
        description: "Пользователь не найден.",
        variant: "destructive",
      });
    },
    retry: 1,
    staleTime: 1000 * 60 * 60,

  });
  if (user.isLoading)
    return (
      <div className="h-screen flex justify-center items-center bg-[#EBEFF3]">
        <Loader2Icon className="w-10 h-10 animate-spin" />
      </div>
    );
  return <Outlet />;
};
export const Route = createRootRoute({
  component: Root,
});
