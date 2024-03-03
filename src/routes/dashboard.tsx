import api from "@/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Ban,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  DoorOpen,
  MinusCircle,
  MoreHorizontal,
  Settings,
  UserMinus,
  UserPlus,
  Wrench,
  XIcon,
} from "lucide-react";
import { UseQueryResult, useMutation, useQuery } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table as ReactTable,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  FilterFn,
  getFacetedUniqueValues,
  createColumnHelper,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ResponseUser, User as UserValues } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosResponse } from "axios";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard")({
  component: Index,
});
export const rulesString = {
  equals: (value: string, initalValue: string) =>
    value.toLocaleLowerCase() === initalValue.toLocaleLowerCase(),
  contains: (value: string, initalValue: string) =>
    initalValue.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
  startsWith: (value: string, initalValue: string) =>
    initalValue.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()),
  endsWith: (value: string, initalValue: string) =>
    initalValue.toLocaleLowerCase().endsWith(value.toLocaleLowerCase()),
  notEquals: (value: string, initalValue: string) =>
    value.toLocaleLowerCase() !== initalValue.toLocaleLowerCase(),
  notContains: (value: string, initalValue: string) =>
    !initalValue.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
};
export const rulesNumber = {
  equals: (value: number, initalValue: number) => value === initalValue,
  lessThanOrEqual: (value: number, initialValue: number) =>
    Number(initialValue) <= Number(value),
  greaterThanOrEqual: (value: number, initialValue: number) =>
    Number(initialValue) >= Number(value),
  lessThan: (value: number, initialValue: number) =>
    Number(initialValue) < Number(value),
  greaterThan: (value: number, initialValue: number) =>
    Number(initialValue) > Number(value),
  notEquals: (value: number, initialValue: number) => initialValue !== value,
};

type StringRule = keyof typeof rulesString;
type NumberRule = keyof typeof rulesNumber;

export const validateValue = (
  value: string | number | Date,
  initialValue: string | number | Date,
  rule: StringRule | NumberRule
) => {
  if (typeof value === "string" && typeof initialValue === "string") {
    return rulesString[rule as StringRule](value, initialValue);
  }

  if (typeof value === "number" && typeof initialValue === "number") {
    return rulesNumber[rule as NumberRule](value, initialValue);
  }

  if (value instanceof Date && initialValue instanceof Date) {
    return rulesNumber[rule as NumberRule](
      value.getTime(),
      initialValue.getTime()
    );
  }

  return false;
};
function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
export type Patient = {
  id?: number;
  full_name?: string;
  gender?: "м" | "ж";
  birthday?: string;
  age?: number;
  inhabited_localit?: "Деревня" | "Город";
  living_place?: string;
  job_title?: string;
  diagnosis?: string;
  first_visit?: string;
  last_visit?: string;
  treatment?: string;
  bp?: "Да" | "Нет";
  ischemia?: "Да" | "Нет";
  dep?: "Да" | "Нет";
  therapist_id?: string;
};
const columnHelper = createColumnHelper<Patient>();

type FormFilterConfig = {
  filter: {
    field: string;
    value: string;
    rule: string;
  }[];
};
const FilterTypeSchema = z.object({
  type: z.enum(["all", "any"], {
    required_error: "You need to select a notification type.",
  }),
});
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
function calculateAge(dateOfBirth: string) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const multiFilter: FilterFn<any> = (
  rowOriginal,
  _,
  value: {
    type: "find" | "all" | "any" | "therapist";
    value:
      | string
      | { rule: StringRule | NumberRule; value: string; field: string }[];
  }
) => {
  const row = {
    ...rowOriginal.original,
    age: calculateAge(rowOriginal.original.birthday),
    first_visit:
      rowOriginal.original.first_visit &&
      Date.parse(rowOriginal.original.first_visit)
        ? new Date(rowOriginal.original.first_visit)
        : undefined,
    last_visit:
      rowOriginal.original.last_visit &&
      Date.parse(rowOriginal.original.last_visit)
        ? new Date(rowOriginal.original.last_visit)
        : undefined,
    birthday:
      rowOriginal.original.birthday && Date.parse(rowOriginal.original.birthday)
        ? new Date(rowOriginal.original.birthday)
        : undefined,
  };

  if (!value.value.length) {
    return true;
  }
  if (value.type === "find" && typeof value.value === "string") {
    return value.value
      .split(" ")
      .map((e) => e.toLowerCase())
      .every((e) =>
        Object.values(row)
          .map((e: any) =>
            Date.parse(e) ? new Date(e).toLocaleString("ru-Ru") : e
          )
          .join("")
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(e)
      );
  }
  if (value.type === "all" && Array.isArray(value.value)) {
    return value.value.every(({ value: filterValue, field, rule }) =>
      validateValue(filterValue, row[field], rule || "contains")
    );
  }
  if (value.type === "any" && Array.isArray(value.value)) {
    return value.value.some(({ value: filterValue, field, rule }) =>
      validateValue(filterValue, row[field], rule || "contains")
    );
  }
  if (value.type === "therapist") {
    return value.value === rowOriginal.original.therapist_id;
  }
  return false;
};

function Index() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterConfig = useForm<FormFilterConfig>();
  const filterArray = useFieldArray({
    name: "filter",
    control: filterConfig.control,
  });

  const navigate = useNavigate();
  const mutation = useMutation(
    () => {
      return api.post("auth/logout");
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы вышли из систему",
        });
        navigate({
          to: "/",
        });
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Платный выход 😁",
          variant: "destructive",
        });
      },
    }
  );
  const patients = useQuery({
    queryKey: ["patients"],
    queryFn: () =>
      api.get<Patient[]>("get_all_patient_records", {
        params: {
          limit: 10000,
        },
      }),
  });

  const user = useQuery<AxiosResponse<UserValues>>({
    queryKey: ["user"],
    queryFn: () => api.get("users/get_user"),
    onError: (err) => {
      console.log(err);
      navigate({
        to: "/",
      });
      toast({
        title: "Выход",
        description: "Войдите заново",
        variant: "destructive",
      });
    },
  });

  const filterType = useForm<z.infer<typeof FilterTypeSchema>>({
    resolver: zodResolver(FilterTypeSchema),
    defaultValues: {
      type: "all",
    },
  });
  const EditCell = ({ row }: { row: Row<Patient> }) => {
    const patientRemove = useMutation(
      () => {
        return api.delete<ResponseUser>("delete_patient_record", {
          params: {
            patient_id: row.original.id,
          },
        });
      },
      {
        onSuccess: () => {
          toast({
            title: "Успешно",
            description: "Вы удалили пациента",
          });
          table.resetGlobalFilter();
          patients.refetch();
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
    return (
      <Popover>
        <PopoverTrigger>
          <MoreHorizontal />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col space-y-2 ">
            <DrawerDialogInforamtion defaultValues={row.original} />
            {row.original.therapist_id ===
              localStorage.getItem("therapist_id") && (
              <>
                <DrawerDialogEdit
                  defaultValues={row.original}
                  update={patients.refetch}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Удалить</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие невозможно отменить. Это приведет к
                        необратимому удалению данных с наших серверов.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Закрыть</AlertDialogCancel>
                      <AlertDialogAction onClick={() => patientRemove.mutate()}>
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "full_name",

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ФИО" />
      ),
      cell: ({ row }) => <p>{row.original.full_name}</p>,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Пол" />
      ),
      cell: ({ row }) =>
        row.original.gender === "м" ? (
          <Badge className="text-blue-600 bg-blue-200">М</Badge>
        ) : (
          <Badge className="text-red-600 bg-red-200">Ж</Badge>
        ),
    },
    {
      accessorKey: "birthday",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Дата рождения" />
      ),
      cell: ({ row }) =>
        row.original.birthday && Date.parse(row.original.birthday) ? (
          <p> {new Date(row.original.birthday).toLocaleString("ru-Ru")} </p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "age",

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Возраст" />
      ),
      cell: ({ row }) => {
        if (row.original.birthday) {
          const age = calculateAge(row.original.birthday);
          return (
            <Badge
              variant="outline"
              className={`${
                age && age >= 0 && age < 18
                  ? "bg-cyan-200 text-cyan-700"
                  : age && age >= 18 && age < 30
                    ? "bg-green-200 text-green-700"
                    : age && age >= 30 && age < 50
                      ? "bg-blue-200 text-blue-700"
                      : age && age >= 50 && age < 65
                        ? "bg-orange-200 text-orange-700"
                        : "bg-red-200 text-red-700"
              }`}
            >
              {age}
            </Badge>
          );
        } else {
          return <Ban className="text-red-600" />;
        }
      },
      enableSorting: false,
    },
    {
      accessorKey: "inhabited_localit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Населенный пункт" />
      ),
      cell: ({ row }) =>
        row.original.inhabited_localit ? (
          <p className="truncate w-12">{row.original.inhabited_localit}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "living_place",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Место жительства" />
      ),
      cell: ({ row }) =>
        row.original.living_place ? (
          <p className="truncate w-12">{row.original.living_place}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "job_title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Должность" />
      ),
      cell: ({ row }) =>
        row.original.job_title ? (
          <p className="truncate">{row.original.job_title}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "diagnosis",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Диагноз" />
      ),
      cell: ({ row }) =>
        row.original.diagnosis ? (
          <p className="truncate w-12">{row.original.diagnosis}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "first_visit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Первый визит" />
      ),
      cell: ({ row }) =>
        row.original.first_visit && Date.parse(row.original.first_visit) ? (
          <p>{new Date(row.original.first_visit).toLocaleString("ru-Ru")}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "last_visit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Последний визит" />
      ),
      cell: ({ row }) =>
        row.original.last_visit && Date.parse(row.original.last_visit) ? (
          <p>{new Date(row.original.last_visit).toLocaleString("ru-Ru")}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "treatment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Лечение" />
      ),
      cell: ({ row }) =>
        row.original.treatment ? (
          <p className="truncate w-12">{row.original.treatment}</p>
        ) : (
          <Ban className="text-red-600" />
        ),
    },
    {
      accessorKey: "bp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="БП" />
      ),
      cell: ({ row }) =>
        row.original.bp === "Да" ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <MinusCircle className="text-red-600" />
        ),
    },
    {
      accessorKey: "ischemia",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ишемия" />
      ),
      cell: ({ row }) =>
        row.original.ischemia === "Да" ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <MinusCircle className="text-red-600" />
        ),
    },
    {
      accessorKey: "dep",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ДЭП" />
      ),
      cell: ({ row }) =>
        row.original.dep === "Да" ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <MinusCircle className="text-red-600" />
        ),
    },
    columnHelper.display({
      id: "edit",
      cell: EditCell,
    }),
  ];
  const table = useReactTable({
    data: patients.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: multiFilter,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    const subscriptionConfig = filterConfig.watch(({ filter }) => {
      table.setGlobalFilter({
        type: filterType.getValues("type"),
        value: filter,
      });
    });

    return () => {
      subscriptionConfig.unsubscribe();
    };
  }, [filterConfig.watch]);

  useEffect(() => {
    const subscriptionConfig = filterType.watch(({ type }) => {
      if (!filterConfig.getValues("filter").length) {
        table.resetGlobalFilter();
      } else {
        table.setGlobalFilter({
          type,
          value: filterConfig.getValues("filter"),
        });
      }
    });
    return () => {
      subscriptionConfig.unsubscribe();
    };
  }, [filterType.watch]);

  return (
    <div className="p-6 h-screen flex gap-2">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <DrawerDialogPatient update={patients.refetch} />
          <Button
            variant={"outline"}
            onClick={() =>
              table.setGlobalFilter({
                type: "therapist",
                value: user.data?.data.id,
              })
            }
          >
            Мои пациенты
          </Button>
          {user.data?.data.is_superuser && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Settings />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-between">
                <ScrollArea>
                  <div>
                    <SheetHeader>
                      <SheetDescription>Админка</SheetDescription>
                    </SheetHeader>
                    <Users />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}

          <Form {...filterType}>
            <form>
              <FormField
                control={filterType.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фильтр</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">Весь</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="any" />
                          </FormControl>
                          <FormLabel className="font-normal">Любой </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Button
            variant={"outline"}
            type="button"
            onClick={() =>
              filterArray.append({
                field: "",
                value: "",
                rule: "",
              })
            }
          >
            Добавить фильтр
          </Button>
          <ScrollArea className="whitespace-nowrap h-[600px]">
            <div className="my-5 flex flex-col gap-5">
              <Form {...filterConfig}>
                {filterArray.fields?.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <FormField
                      name={`filter.${index}.field`}
                      control={filterConfig.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Поле" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full_name">ФИО</SelectItem>
                              <SelectItem value="gender">Пол</SelectItem>
                              <SelectItem value="birthday">
                                Дата рождения
                              </SelectItem>
                              <SelectItem value="age">Возраст</SelectItem>
                              <SelectItem value="inhabited_localit">
                                Населенный пункт
                              </SelectItem>

                              <SelectItem value="job_title">
                                Должность
                              </SelectItem>
                              <SelectItem value="living_place">
                                Место жительства
                              </SelectItem>
                              <SelectItem value="first_visit">
                                Первый визит
                              </SelectItem>
                              <SelectItem value="last_visit">
                                Последний визит
                              </SelectItem>
                              <SelectItem value="bp">БП</SelectItem>
                              <SelectItem value="ischemia">Ишемия</SelectItem>
                              <SelectItem value="dep">ДЭП</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <ConditionField
                      key={field.id}
                      index={index}
                      control={filterConfig.control}
                      setIsFiltering={setIsFiltering}
                    />

                    <Button
                      type="button"
                      onClick={() => filterArray.remove(index)}
                      variant={"destructive"}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </Form>
            </div>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
        <Button onClick={() => mutation.mutate()} variant={"ghost"}>
          <DoorOpen />
          Выйти
        </Button>
      </div>
      <div className="flex flex-col gap-2 mx-auto">
        <div className="flex  gap-10">
          <DebouncedInput
            value={
              typeof table.getState().globalFilter?.value === "string"
                ? table.getState().globalFilter?.value
                : ""
            }
            placeholder="Поиск"
            onChange={(value) =>
              table.setGlobalFilter({ type: "find", value: value })
            }
            setIsDebouncing={setIsFiltering}
          />
          <div className="flex items-center gap-10">
            <div className="shadow px-2 flex items-center">
              <p className="border-r pr-4 mr-4 h-full">Пол</p>
              <ul>
                <li className="text-nowrap">
                  м:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.gender === "м").length
                  }
                </li>
                <li className="text-nowrap">
                  ж:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.gender !== "м").length
                  }
                </li>
              </ul>
            </div>
            <div className="shadow px-2 flex items-center">
              <p className="border-r pr-4 mr-4">Ишемия</p>
              <ul>
                <li className="text-nowrap">
                  Да:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.ischemia === "Да")
                      .length
                  }
                </li>
                <li className="text-nowrap">
                  Нет:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.ischemia === "Нет")
                      .length
                  }
                </li>
              </ul>
            </div>
            <div className="shadow px-2 flex items-center">
              <p className="border-r pr-4 mr-4">БП</p>
              <ul>
                <li className="text-nowrap">
                  Да:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.bp === "Да").length
                  }
                </li>
                <li className="text-nowrap">
                  Нет:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.bp === "Нет").length
                  }
                </li>
              </ul>
            </div>

            <div className="shadow px-2 flex items-center">
              <p className="border-r pr-4 mr-4">ДЭП</p>
              <ul>
                <li className="text-nowrap">
                  Да:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.dep === "Да").length
                  }
                </li>
                <li className="text-nowrap">
                  Нет:{" "}
                  {
                    table
                      .getFilteredRowModel()
                      .rows.filter((row) => row.original.dep === "Нет").length
                  }
                </li>
              </ul>
            </div>
            <div className="shadow px-2">
              <ul>
                <li className="text-nowrap">
                  Всего: {table.getPreFilteredRowModel().rows.length}
                </li>
                <li className="text-nowrap">
                  Найдено: {table.getFilteredRowModel().rows.length}{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DataTablePagination table={table} />

        <div className="rounded-lg bg-white shadow">
          {!isFiltering && !patients.isLoading ? (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-none">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="p-3">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-none "
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <>
              <Skeleton className="h-12" />
              <Skeleton className="h-12 mt-2" />
              <Skeleton className="h-12 mt-2" />
              <Skeleton className="h-12 mt-2" />
              <Skeleton className="h-12 mt-2" />
              <Skeleton className="h-12 mt-2" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  setIsDebouncing,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  setIsDebouncing?: (value: boolean) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
      if (setIsDebouncing) {
        setIsDebouncing(false);
      }
    }, debounce);
    if (setIsDebouncing) {
      setIsDebouncing(true);
    }

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const ConditionField = ({
  control,
  index,
  setIsFiltering,
}: {
  control: Control<FormFilterConfig>;
  index: number;
  setIsFiltering?: (value: boolean) => void;
}) => {
  const output = useWatch({
    name: "filter",
    control,
  });
  return (
    <>
      {/* rules */}
      {/* text */}
      {(output[index]?.field === "full_name" ||
        output[index]?.field === "living_place" ||
        output[index]?.field === "treatment" ||
        output[index]?.field === "job_title" ||
        output[index]?.field === "diagnosis") && (
        <FormField
          name={`filter.${index}.rule`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Правило" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contains">Содержит</SelectItem>
                  <SelectItem value="notContains">Не содержит</SelectItem>
                  <SelectItem value="equals">Равно</SelectItem>
                  <SelectItem value="notEquals">Не равно</SelectItem>
                  <SelectItem value="startsWith">Начинается с</SelectItem>
                  <SelectItem value="endsWith">Заканчивается на</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {/* number */}
      {(output[index]?.field === "age" ||
        output[index]?.field === "birthday" ||
        output[index]?.field === "first_visit" ||
        output[index]?.field === "last_visit") && (
        <FormField
          name={`filter.${index}.rule`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Правило" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="equals">=</SelectItem>
                  <SelectItem value="notEquals">≠</SelectItem>
                  <SelectItem value="lessThanOrEqual">≤</SelectItem>
                  <SelectItem value="greaterThanOrEqual">≥</SelectItem>
                  <SelectItem value="lessThan">{"<"}</SelectItem>
                  <SelectItem value="greaterThan">{">"}</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {/* values */}
      {/* select */}
      {output[index]?.field === "gender" && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Да или ж" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="М">М</SelectItem>
                  <SelectItem value="Ж">Ж</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {output[index]?.field === "inhabited_localit" && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Город или деревня" />
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
      )}
      {(output[index]?.field === "bp" ||
        output[index]?.field === "ischemia" ||
        output[index]?.field === "dep") && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Да или нет" />
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
      )}
      {/* input */}
      {(output[index]?.field === "full_name" ||
        output[index]?.field === "living_place" ||
        output[index]?.field === "treatment" ||
        output[index]?.field === "job_title" ||
        output[index]?.field === "diagnosis") && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <DebouncedInput
                type="text"
                onChange={field.onChange}
                value={field.value}
                setIsDebouncing={setIsFiltering}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {output[index]?.field === "age" && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Input
                type="number"
                min={0}
                max={150}
                defaultValue={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {/* date */}
      {(output[index]?.field === "birthday" ||
        output[index]?.field === "first_visit" ||
        output[index]?.field === "last_visit") && (
        <>
          <FormField
            name={`filter.${index}.value`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <DatePicker placeholder="Выберите дату" field={field} />

                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};

interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>;
}
export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="w-min">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center text-sm font-medium">
        <Input
          type="number"
          min={1}
          max={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
        />{" "}
        <span className="text-nowrap"> / {table.getPageCount()}</span>
      </div>
    </div>
  );
}
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        {...{
          onClick: column.getToggleSortingHandler(),
        }}
      >
        <span>{title}</span>
        {{
          asc: <ChevronUp />,
          desc: <ChevronDown />,
        }[column.getIsSorted() as string] ?? null}
      </Button>
    </div>
  );
}

const PatientForm = ({
  setOpen,
  update,
}: {
  setOpen: (isOpen: boolean) => void;
  update: any;
}) => {
  const patient = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.post<ResponseUser>("create_patient_record", values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы добавили пользователя",
        });
        setOpen(false);
        update();
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
    full_name: z.string().optional(),
    gender: z.union([z.literal("м"), z.literal("ж")]).optional(),
    birthday: z.date().optional(),
    inhabited_localit: z
      .union([z.literal("Деревня"), z.literal("Город")])
      .optional(),
    living_place: z.string().optional(),
    job_title: z.string().optional(),
    diagnosis: z.string().optional(),
    first_visit: z.date().optional(),
    last_visit: z.date().optional(),
    treatment: z.string().optional(),
    bp: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    ischemia: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    dep: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    patient.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-2">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
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
              <FormControl>
                <DatePicker placeholder="Дата рождения" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inhabited_localit"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="living_place"
          render={({ field }) => (
            <FormItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <Input placeholder="Должность" {...field} />
                </FormControl>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Диагноз" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_visit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker placeholder="Первое посещение" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_visit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker placeholder="Последнее посещение" field={field} />
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
                <FormControl>
                  <Textarea placeholder="Лечение" {...field} />
                </FormControl>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bp"
          render={({ field }) => (
            <FormItem>
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
          name="ischemia"
          render={({ field }) => (
            <FormItem>
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

        <FormField
          control={form.control}
          name="dep"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ДЭП" />
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

        <Button type="submit" className="w-full" variant={"outline"}>
          Добавить
        </Button>
      </form>
    </Form>
  );
};
const PatientFormUpdate = ({
  defaultValues,
  update,
  setOpen,
}: {
  defaultValues: Patient;
  update: any;
  setOpen: any;
}) => {
  const patient = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.patch<ResponseUser>("update_patient_record", values, {
        params: {
          patient_id: defaultValues.id,
        },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы добавили пользователя",
        });
        update();
        setOpen(false);
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
    full_name: z.string().optional(),
    gender: z.union([z.literal("м"), z.literal("ж")]).optional(),
    birthday: z.date().optional(),
    inhabited_localit: z
      .union([z.literal("Деревня"), z.literal("Город")])
      .optional(),
    living_place: z.string().optional(),
    job_title: z.string().optional(),
    diagnosis: z.string().optional(),
    first_visit: z.date().optional(),
    last_visit: z.date().optional(),
    treatment: z.string().optional(),
    bp: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    ischemia: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
    dep: z.union([z.literal("Да"), z.literal("Нет")]).optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          first_visit:
            defaultValues.first_visit && Date.parse(defaultValues.first_visit)
              ? new Date(defaultValues.first_visit)
              : undefined,
          last_visit:
            defaultValues.last_visit && Date.parse(defaultValues.last_visit)
              ? new Date(defaultValues.last_visit)
              : undefined,
          birthday:
            defaultValues.birthday && Date.parse(defaultValues.birthday)
              ? new Date(defaultValues.birthday)
              : undefined,
        }
      : {},
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    patient.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-3 gap-2"
      >
        <FormItem className="col-span-2">
          <FormLabel>ФИО</FormLabel>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ФИО" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem>
          <FormLabel>Пол</FormLabel>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
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
        </FormItem>
        <FormItem className="col-span-3">
          <FormLabel>Дата рождения</FormLabel>

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker placeholder="Дата рождения" field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem>
          <FormField
            control={form.control}
            name="inhabited_localit"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem>
          <FormField
            control={form.control}
            name="living_place"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Место жительства" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem>
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <Input placeholder="Должность" {...field} />
                  </FormControl>
                </Select>
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem className="col-span-3">
          <FormLabel>Диагноз</FormLabel>

          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Диагноз" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem className="col-span-3">
          <FormLabel>Первое посещение</FormLabel>

          <FormField
            control={form.control}
            name="first_visit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker placeholder="Первое посещение" field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem className="col-span-3">
          <FormLabel>Последнее посещение</FormLabel>

          <FormField
            control={form.control}
            name="last_visit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker placeholder="Последнее посещение" field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>

        <FormItem className="col-span-3">
          <FormLabel>Лечение</FormLabel>

          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormControl>
                    <Textarea placeholder="Лечение" {...field} />
                  </FormControl>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormItem>
        <FormItem>
          <FormLabel>БП</FormLabel>

          <FormField
            control={form.control}
            name="bp"
            render={({ field }) => (
              <FormItem>
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
        </FormItem>
        <FormItem>
          <FormLabel>Ишемия</FormLabel>

          <FormField
            control={form.control}
            name="ischemia"
            render={({ field }) => (
              <FormItem>
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
        </FormItem>
        <FormItem>
          <FormLabel>ДЭП</FormLabel>

          <FormField
            control={form.control}
            name="dep"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="ДЭП" />
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
        </FormItem>

        <Button type="submit" className="w-full col-span-3" variant={"outline"}>
          Сохранить
        </Button>
      </form>
    </Form>
  );
};
const UserAddForm = ({
  users,
}: {
  users: UseQueryResult<AxiosResponse<UserValues[]>>;
}) => {
  const addUser = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return api.post<ResponseUser>("auth/registration", values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: "Вы добавили пользователя",
        });
        users.refetch();
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
    password: z.string().min(8, {
      message: "Пароль должен быть не менее 8 символов",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
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
        <div className="flex gap-2">
          {" "}
          <Button type="submit" className="w-full" variant={"outline"}>
            Добавить
          </Button>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              form.setValue(
                "username",
                "Пользователь" + Math.floor(Math.random() * 1000)
              );
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
const Users = () => {
  const users = useQuery<AxiosResponse<UserValues[]>>({
    queryKey: ["user_getAll"],
    queryFn: () => api.get("users/get_all_users"),
  });
  const deleteUser = useMutation(
    (user_id: string) => {
      return api.delete("users/delete_user", {
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
  const setSuperUser = useMutation(
    (user_id: string) => {
      return api.patch("users/set_superuser", null, {
        params: { user_id },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: `Пользователь был обновлен`,
        });
        users.refetch();
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить пользователя",
          variant: "destructive",
        });
      },
    }
  );
  const deleteSuperUser = useMutation(
    (user_id: string) => {
      return api.delete("users/delete_user_from_superuser", {
        params: { user_id },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Успешно",
          description: `Пользователь был обновлен`,
        });
        users.refetch();
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить пользователя",
          variant: "destructive",
        });
      },
    }
  );
  return (
    <>
      <UserAddForm users={users} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя пользователя</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data?.data.map((user) => (
            <TableRow>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                {user.is_superuser ? (
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => deleteSuperUser.mutate(user.id)}
                  >
                    <UserMinus />{" "}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setSuperUser.mutate(user.id)}
                  >
                    {" "}
                    <UserPlus />
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => deleteUser.mutate(user.id)}
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

function DatePicker({
  placeholder,
  field,
}: {
  placeholder: string;
  field: any;
}) {
  const [timeValue, setTimeValue] = useState<string>("00:00");
  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!field.value) {
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = new Date(
      field.value.getFullYear(),
      field.value.getMonth(),
      field.value.getDate(),
      hours,
      minutes
    );
    field.onChange(newSelectedDate);
    setTimeValue(time);
  };
  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      field.onChange(date);
      return;
    }
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
    field.onChange(newDate);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? (
            new Date(field.value).toLocaleString("ru-Ru")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={handleDaySelect}
          locale={ru}
          footer={
            <Input type="time" value={timeValue} onChange={handleTimeChange} />
          }
        />
      </PopoverContent>
    </Popover>
  );
}
function DrawerDialogInforamtion({
  defaultValues,
}: {
  defaultValues: Patient;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Информация</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Информация о пациенте</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <b>Полное имя:</b> {defaultValues.full_name ?? "-"}
            </p>
            <p>
              <b>Возраст:</b>{" "}
              {defaultValues.birthday
                ? calculateAge(defaultValues.birthday)
                : "-"}
            </p>
            <p>
              <b>Пол:</b> {defaultValues.gender ?? "-"}
            </p>
            <p>
              <b> Дата рождения:</b>{" "}
              {defaultValues?.birthday && Date.parse(defaultValues.birthday)
                ? new Date(defaultValues.birthday).toLocaleString("ru-Ru")
                : "-"}
            </p>
            <p>
              <b>Должность:</b> {defaultValues.job_title ?? "-"}
            </p>
            <p>
              <b> Первое посещение :</b>{" "}
              {defaultValues?.first_visit &&
              Date.parse(defaultValues.first_visit)
                ? new Date(defaultValues.first_visit).toLocaleString("ru-Ru")
                : "-"}
            </p>
            <p>
              <b> Последнее посещение:</b>{" "}
              {defaultValues?.last_visit && Date.parse(defaultValues.last_visit)
                ? new Date(defaultValues.last_visit).toLocaleString("ru-Ru")
                : "-"}
            </p>
            <p>
              <b>Место жительства:</b> {defaultValues.living_place ?? "-"}
            </p>
            <p>
              <b>Населенный пункт:</b> {defaultValues.inhabited_localit ?? "-"}
            </p>
            <ScrollArea className="h-32">
              <p>
                <b>Диагноз:</b> {defaultValues.diagnosis ?? "-"}
              </p>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-32">
              <p>
                <b>Лечение:</b> {defaultValues.treatment ?? "-"}
              </p>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <p>
              <b>БП:</b> {defaultValues.bp ?? "-"}
            </p>
            <p>
              <b>Ишемия: </b>
              {defaultValues.ischemia ?? "-"}
            </p>
            <p>
              <b>Дэп:</b> {defaultValues.dep ?? "-"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Информация</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Информация о пациенте</DrawerTitle>
        </DrawerHeader>
        <p>Полное имя: {defaultValues.full_name}</p>
        <p>Возраст: {defaultValues.age}</p>
        <p>Пол: {defaultValues.gender}</p>
        <p>
          Дата рождения:{" "}
          {defaultValues?.birthday && defaultValues.birthday.toString()}
        </p>
        <p>Должность: {defaultValues.job_title}</p>
        <p>
          Первое посещение :{" "}
          {defaultValues?.first_visit && defaultValues.first_visit.toString()}
        </p>
        <p>
          Последнее посещение:{" "}
          {defaultValues?.last_visit && defaultValues.last_visit.toString()}
        </p>
        <p>Место жительства: {defaultValues.living_place}</p>
        <p>Населенный пункт: {defaultValues.inhabited_localit}</p>
        <p>Диагноз: {defaultValues.diagnosis}</p>
        <p>Лечение: {defaultValues.treatment}</p>
        <p>БП: {defaultValues.bp}</p>
        <p>Ишемия: {defaultValues.ischemia}</p>
        <p>Дэп: {defaultValues.dep}</p>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
function DrawerDialogEdit({
  defaultValues,
  update,
}: {
  defaultValues: Patient;
  update: any;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Редактировать</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Изменить данные</DialogTitle>
          </DialogHeader>
          <PatientFormUpdate
            defaultValues={defaultValues}
            update={update}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Редактировать</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Редактировать данные</DrawerTitle>
        </DrawerHeader>
        <PatientFormUpdate
          defaultValues={defaultValues}
          update={update}
          setOpen={setOpen}
        />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
function DrawerDialogPatient({ update }: { update: any }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Добавить пациента</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <PatientForm setOpen={setOpen} update={update} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Добавить пациента</Button>
      </DrawerTrigger>
      <DrawerContent>
        <PatientForm setOpen={setOpen} update={update} />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
