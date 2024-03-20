import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "react-query";
import api from "@/axios";
import { LoaderIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});
const formSchema = z.object({
  username: z.string().min(4, {
    message: "Имя минимум 4 символа",
  }),
  password: z.string().min(4, {
    message: "Пароль минимум 4 символов",
  }),
});
function Index() {
  const user = useQueryClient();
  const login = useMutation(
    (values: z.infer<typeof formSchema>) => api.post("auth/login", values),
    {
      onMutate: () => {
        user.invalidateQueries("user");
      },
    }
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    login.mutate(values);
  }
  return (
    <div className="h-screen flex items-center justify-center bg-[#EBEFF3] dark:bg-[#333333]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mx-auto shadow p-6 rounded-lg"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Имя пользователя" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Пароль" {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={login.isLoading}>
            {login.isLoading && (
              <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            )}
            Войти
          </Button>
        </form>
      </Form>
    </div>
  );
}
