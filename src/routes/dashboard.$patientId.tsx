import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Patient, PatientRecord, User } from "@/types";
import api from "@/axios";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/ui/use-toast";
import { SaveIcon, XIcon } from "lucide-react";
import { AxiosResponse } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ExportToExcel } from "@/components/excel-export";
const RecordForm = ({ defaultValues }: { defaultValues: PatientRecord }) => {
  const formSchema = z.object({
    visit: z.date().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
  });
  const patientRecords = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      visit: Date.parse(defaultValues.visit)
        ? new Date(defaultValues.visit)
        : undefined,
      diagnosis: defaultValues.diagnosis,
      treatment: defaultValues.treatment,
    },
  });
  const deleteRecord = useMutation(
    () =>
      api.delete("patient_records/delete", {
        params: {
          patient_record_id: defaultValues.id,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: `Запись (${defaultValues.visit}) успешно удалена.`,
        });
        patientRecords.invalidateQueries(
          `patient_records${defaultValues.patient_id}`
        );
      },
    }
  );
  const recordUpdate = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.patch<PatientRecord>(
        "patient_records/update_patient_record",
        values,
        {
          params: {
            patient_record_id: defaultValues.id,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Успешно",
          description: `Данные записи (${data.data.visit}) успешно обновлены.`,
        });
      },
      onError: () => {},
    }
  );
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    recordUpdate.mutate(values);
  };
  return (
    <>
      <Form {...form}>
        <form
          className="w-full mt-4 xl:p-6 p-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="visit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DatePicker
                      placeholder="Дата приема"
                      field={field}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="xl:flex hidden px-4 gap-2">
              <Button size={"icon"}>
                <SaveIcon />
              </Button>
              <Button
                onClick={() => deleteRecord.mutate()}
                type="button"
                size={"icon"}
              >
                <XIcon />
              </Button>
            </div>
          </div>
          <div className="flex xl:flex-row flex-col gap-4 mt-2">
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem className="xl:w-1/2">
                  <FormLabel>Диагноз</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Диагноз"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem className="xl:w-1/2">
                  <FormLabel>Лечение</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Лечение"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 my-4 xl:hidden block">
            <Button size={"icon"}>
              <SaveIcon />
            </Button>
            <Button
              onClick={() => deleteRecord.mutate()}
              type="button"
              size={"icon"}
            >
              <XIcon />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
const NewRecordForm = ({ patient_id }: { patient_id: String }) => {
  const formSchema = z.object({
    visit: z.date(),
    diagnosis: z.string(),
    treatment: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const patientRecords = useQueryClient();

  const patient = useMutation(
    (values: z.infer<typeof formSchema>) =>
      api.post("patient_records/create", {
        ...values,
        patient_id,
      }),
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Запись успешно создана.",
        });
        patientRecords.invalidateQueries(`patient_records${patient_id}`);
      },
    }
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => patient.mutate(values))}
        className="p-6 space-y-2"
      >
        <FormField
          control={form.control}
          name="visit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  placeholder="Дата приема"
                  field={field}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="rounded-2xl"
                  placeholder="Диагноз"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="rounded-2xl"
                  placeholder="Лечение"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Добавить</Button>
      </form>
    </Form>
  );
};
const PatientForm = () => {
  const navigate = useNavigate();
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");
  const patient_id = Route.useParams().patientId;
  const formSchema = z.object({
    full_name: z.string().optional(),
    gender: z.union([z.literal("м"), z.literal("ж")]).optional(),
    birthday: z.date().optional(),
    inhabited_locality: z
      .union([z.literal("Деревня"), z.literal("Город")])
      .optional(),
    living_place: z.string().optional(),
    job_title: z.string().optional(),
    bp: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    dep: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    ischemia: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
  });
  const patient = useQuery(
    `patient${patient_id}`,
    () =>
      api.get<Patient>(`patient/get`, {
        params: {
          patient_id,
        },
      }),
    {
      onSuccess: (data) => {
        if (
          user &&
          data.data.therapist_id !== user.data.id &&
          !user.data.is_superuser
        ) {
          navigate({ to: "/dashboard" });
        }
      },
    }
  );
  const patientRecords = useQuery(`patient_records${patient_id}`, () =>
    api.get<PatientRecord[]>(`patient_records/get_all_by_patient`, {
      params: {
        patient_id,
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: patient.data?.data
      ? {
          ...patient.data.data,
          birthday:
            patient.data.data.birthday && Date.parse(patient.data.data.birthday)
              ? new Date(patient.data.data.birthday)
              : undefined,
        }
      : {},
  });

  const patientUpdate = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.patch("patient/update", values, {
        params: {
          patient_id,
        },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Данные успешно обновлены.",
        });
      },
      onError: () => {},
    }
  );
  return (
    <div className="flex gap-6 xl:flex-row flex-col">
      <div className="block xl:hidden">
        <Drawer>
          <DrawerTrigger className="w-full">
            <Button className="w-full">Данные пациента</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Данные пациента</DrawerTitle>
              <DrawerDescription>
                Можете изменить данные пациента
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea>
              <div className="h-96 p-6">
                <Form {...form}>
                  <form
                    className=""
                    onSubmit={form.handleSubmit((values) =>
                      patientUpdate.mutate(values)
                    )}
                  >
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ФИО</FormLabel>
                          <FormControl>
                            <Input
                              value={String(field.value)}
                              onChange={field.onChange}
                              placeholder="ФИО"
                            />
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
                              value={field.value}
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
                            <DatePicker
                              placeholder="Дата рождения"
                              field={field}
                            />
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
                          <FormLabel>Населенный пункт</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Населенный пункт" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Город">Город</SelectItem>
                              <SelectItem value="Деревня">Деревня</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                            <Input
                              value={String(field.value)}
                              onChange={field.onChange}
                              placeholder="Место жительства"
                            />
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

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <Input
                                value={String(field.value)}
                                onChange={field.onChange}
                                placeholder="Должность"
                              />
                            </FormControl>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Бп</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                    <Button className="w-full my-4">Сохранить</Button>
                  </form>
                </Form>
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="xl:block hidden space-y-2">
        <Form {...form}>
          <form
            className="space-y-2 p-6 w-full shadow-neumorphism-box dark:shadow-none rounded-2xl w-1/3"
            onSubmit={form.handleSubmit((values) =>
              patientUpdate.mutate(values)
            )}
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="ФИО"
                    />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormLabel>Населенный пункт</FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Населенный пункт" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Город">Город</SelectItem>
                      <SelectItem value="Деревня">Деревня</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                    <Input
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Место жительства"
                    />
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

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <Input
                        value={String(field.value)}
                        onChange={field.onChange}
                        placeholder="Должность"
                      />
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бп</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <Button>Сохранить</Button>
          </form>
        </Form>
      </div>

      <div className="w-full space-y-4">
        <div className="hidden xl:block shadow-neumorphism-box dark:shadow-none rounded-2xl">
          <NewRecordForm patient_id={patient_id} />
        </div>
        <div className="block xl:hidden">
          <Drawer>
            <DrawerTrigger className="w-full">
              <Button className="w-full">Добавить запись</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Новая запись</DrawerTitle>
                <DrawerDescription>Заполните форму записи</DrawerDescription>
              </DrawerHeader>
              <NewRecordForm patient_id={patient_id} />
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden xl:block p-6 w-full shadow-neumorphism-box dark:shadow-none w-1/2 rounded-2xl">
          <ExportToExcel
            dataSet={patientRecords.data?.data}
            fileName={`Пациент ${patient_id}`}
          />
          {patientRecords.data?.data.length ? (
            <ScrollArea className="w-full pr-4">
              {patientRecords.data?.data.map((record) => (
                <RecordForm defaultValues={record} key={record.id} />
              ))}
            </ScrollArea>
          ) : (
            <div className=" flex items-center justify-center h-full">
              <p>Нет записей</p>
            </div>
          )}
        </div>
        <div className="xl:hidden block ">
          <ExportToExcel
            dataSet={patientRecords.data?.data}
            fileName={`Пациент ${patient_id}`}
          />
        </div>
        <ScrollArea className="h-96 xl:hidden block">
          <div className="p-4 flex flex-col gap-4">
            {patientRecords.data?.data.length ? (
              patientRecords.data?.data.map((record) => (
                <Drawer>
                  <DrawerTrigger>
                    <Button>{record.visit}</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Запись {record.visit}</DrawerTitle>
                      <DrawerDescription>
                        Можете изменить запись
                      </DrawerDescription>
                    </DrawerHeader>
                    <RecordForm defaultValues={record} />
                  </DrawerContent>
                </Drawer>
              ))
            ) : (
              <p className="text-center">Нет записей</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/$patientId")({
  component: PatientForm,
});
