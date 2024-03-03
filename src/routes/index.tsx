import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/axios";
import { useMutation, useQuery } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { ResponseUser, User } from "@/types";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Имя пользователя минимум 3 символа" }),
  password: z.string().min(3, { message: "Пароль минимум 3 символов" }),
});
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.post<ResponseUser>("auth/login", values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы вошли в систему",
        });
        navigate({
          to: "/dashboard",
        });
      },
      onError: (err) => {
        console.log(err)
        toast({
          title: "Ошибка",
          description: "КОРС",
          variant: "destructive",
        });
      },
    }
  );
  useQuery({
    queryKey: ["user"],
    queryFn: () => api.get<User>("users/get_user"),
    onSuccess: (res) => {
      localStorage.setItem("therapist_id", res.data.id);
      navigate({
        to: "/dashboard",
      });
    },
    onError: (err) => {
      console.log("Error", err);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    login.mutate(values);
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="md:w-1/6">
        <CardHeader>
          <CardTitle className="text-center">Вход</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Имя пользователя"
                        {...field}
                      />
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
                      <Input placeholder="Пароль" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={login.isLoading}
              >
                {login.isLoading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Войти"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
