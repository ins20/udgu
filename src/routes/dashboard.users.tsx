import api from "@/axios";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { generatePassword } from "@/lib/utils";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosResponse } from "axios";
import { Wrench, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";


const Users = () => {
  const navigate = useNavigate();
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");
  if (!user?.data.is_superuser) navigate({ to: "/" });

  const users = useQuery<AxiosResponse<User[]>>({
    queryKey: ["users"],
    queryFn: () => api.get("users/get_all"),
  });
  const deleteUser = useMutation(
    (user_id: string) => {
      return api.delete("users/deactivate", {
        params: { user_id },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: `Пользователь удален`,
        });
        users.refetch();
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить пользователя",
          variant: "destructive",
        });
      },
    }
  );
  const setUserRole = useMutation(
    (params: { user_id: string; new_role: string }) => {
      return api.patch("users/set_user_role", null, {
        params,
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: `Роль пользователя была обновлена`,
        });
        users.refetch();
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить роль пользователя",
          variant: "destructive",
        });
      },
    }
  );

  return (
    <div className="flex xl:flex-row flex-col gap-6 h-full">
      <div className="xl:w-1/2 shadow-neumorphism dark:shadow p-6 rounded-2xl h-min">
        <UserAddForm />
      </div>

      <div className="xl:w-1/2 shadow-neumorphism dark:shadow xl:p-6 p-3 rounded-2xl h-full">
        <Table>
          <TableBody className="space-y-2 mt-2">
            {users.data?.data.map((user) => (
              <TableRow
                className="hover:bg-transparent border-none"
                key={user.id}
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(new_role) =>
                      setUserRole.mutate({ user_id: user.id, new_role })
                    }
                    defaultValue={user.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapist">Врач</SelectItem>
                      <SelectItem value="explorer">Исследователь</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    size={"icon"}
                    onClick={() => deleteUser.mutate(user.id)}
                  >
                    <XIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/users")({
  component: Users,
});

const UserAddForm = () => {
  const users = useQueryClient();

  const addUser = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.post("auth/registration", values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы добавили пользователя",
        });
        users.invalidateQueries("users");
        form.reset();
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить пользователя",
          variant: "destructive",
        });
      },
    }
  );
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Имя пользователя должно быть не менее 2 символов",
    }),
    password: z.string().min(6, {
      message: "Пароль должен быть не менее 6 символов",
    }),
    role: z.union([z.literal("explorer"), z.literal("therapist")]),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "therapist",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addUser.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя пользователя" {...field} />
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
              <FormLabel>Пароль пользователя</FormLabel>
              <FormControl>
                <Input placeholder="Введите пароль пользователя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="therapist">Врач</SelectItem>
                  <SelectItem value="explorer">Исследователь</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          {" "}
          <Button type="submit" className="w-full">
            Добавить
          </Button>
          <Button
            type="button"
            size={"icon"}
            onClick={() => {
              form.setValue(
                "username",
                "Пользователь" + Math.floor(Math.random() * 1000)
              );
              form.clearErrors();
              form.setValue("password", generatePassword());
            }}
          >
            <Wrench />
          </Button>
        </div>
      </form>
    </Form>
  );
};
