import api from "@/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { AxiosResponse } from "axios";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

const formSchema = z.object({
  old_password: z.string().min(6, {
    message: "Пароль минимум 6 символов",
  }),
  new_password: z.string().min(6, {
    message: "Пароль минимум 6 символов",
  }),
});

const DashboardProfile = () => {
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");
  if(!user) return 
  const changePassword = useMutation(
    (values: z.infer<typeof formSchema>) =>
      api.patch("users/change_password", values),
    {
      onSuccess: () => {
        toast({
          description: "Вы вошли в аккаунт",
          title: "Вход",
        });
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    changePassword.mutate(values);
  }
  return (
    <div className="h-full flex align-items justify-center">
      <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl h-fit my-auto">
        <p className="text-xl">{user?.data.username}</p>
        <p className="my-4">{user?.data.role === "therapist" ? "Врач" : "Исследователь"}</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mx-auto "
          >
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Текущий пароль"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Новый пароль"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={changePassword.isLoading}
            >
              {changePassword.isLoading && (
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              Изменить
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/profile")({
  component: DashboardProfile,
});
