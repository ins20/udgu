import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import api from "@/axios";
import { toast } from "./ui/use-toast";
export const PatientForm = () => {
  const patient = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.post("patient/create", values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Пациент успешно создан",
        });
        form.reset()
        patients.invalidateQueries("patients");
      },
      onError: () => {},
    }
  );
  const patients = useQueryClient();
  const formSchema = z.object({
    full_name: z.string(),
    gender: z.union([z.literal("м"), z.literal("ж")]),
    birthday: z.date().optional(),
    inhabited_locality: z
      .union([z.literal("Деревня"), z.literal("Район")])
      .optional(),
    living_place: z.string().optional(),
    job_title: z.string().optional(),
    bp: z.union([z.literal("Да"), z.literal("Нет")]),
    dep: z.union([z.literal("Да"), z.literal("Нет")]),
    ischemia: z.union([z.literal("Да"), z.literal("Нет")]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // values: {
    //   full_name: "sdf",
    //   gender: "м",
    //   birthday: new Date(),
    //   inhabited_locality: "Город",
    //   living_place: "sdf",
    //   job_title: "sdf",
    //   bp: "Да",
    //   dep: "Да",
    //   ischemia: "Да",
    // },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    patient.mutate(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between gap-3"
      >
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фио</FormLabel>
              <FormControl>
                <Input placeholder="ФИО" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пол</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Пол" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="м">м</SelectItem>
                    <SelectItem value="ж">ж</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата рождения</FormLabel>
              <FormControl>
                <DatePicker placeholder="Дата рождения" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inhabited_locality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Населенный пункт</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Населенный пункт" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Город">Город</SelectItem>
                  <SelectItem value="Район">Район</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="living_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Место жительства</FormLabel>
              <FormControl>
                <Input placeholder="Место жительства" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Положение</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <Input placeholder="Положение" {...field} />
                </FormControl>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бп</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="БП" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Да">Да</SelectItem>
                  <SelectItem value="Нет">Нет</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Деп</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Деп" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Да">Да</SelectItem>
                  <SelectItem value="Нет">Нет</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ischemia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ишемия</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Ишемия" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Да">Да</SelectItem>
                  <SelectItem value="Нет">Нет</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full my-4">
          Добавить
        </Button>
      </form>
    </Form>
  );
};
