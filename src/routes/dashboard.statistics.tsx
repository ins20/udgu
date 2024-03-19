import ConditionField from "@/components/condition-input";
import DataTableColumnHeader from "@/components/data-table-column-header";
import { DataTablePagination } from "@/components/data-table-pagination";
import DebouncedInput from "@/components/debounce-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NumberRule,
  StringRule,
  calculateAge,
  validateValue,
} from "@/lib/utils";
import { FormFilterConfig, Patient } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  ColumnDef,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { SearchIcon } from "lucide-react";
import { ExportToExcel } from "@/components/excel-export";

const multiFilter: FilterFn<any> = (
  rowOriginal,
  _,
  value: {
    type: "find" | Boolean;
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
    inhabited_locality:
      rowOriginal.original.inhabited_locality === "Город" ? "Город" : "Район",
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
  if (value.type && Array.isArray(value.value)) {
    return value.value.every(({ value: filterValue, field, rule }) =>
      validateValue(filterValue, row[field], rule || "contains")
    );
  }
  if (!value.type && Array.isArray(value.value)) {
    return value.value.some(({ value: filterValue, field, rule }) =>
      validateValue(filterValue, row[field], rule || "contains")
    );
  }

  return false;
};

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Пол" />
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
        "-"
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
        return age;
      } else {
        return "-";
      }
    },
    enableSorting: false,
  },
  {
    accessorKey: "inhabited_localit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Населенный пункт" />
    ),
    cell: ({ row }) => row.original.inhabited_locality || "-",
  },

  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Положение" />
    ),
    cell: ({ row }) => row.original.job_title || "-",
  },

  {
    accessorKey: "bp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="БП" />
    ),
    cell: ({ row }) => (row.original.bp ? "Да" : "Нет"),
  },
  {
    accessorKey: "ischemia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ишемия" />
    ),
    cell: ({ row }) => (row.original.ischemia ? "Да" : "Нет"),
  },
  {
    accessorKey: "dep",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ДЭП" />
    ),
    cell: ({ row }) => (row.original.dep ? "Да" : "Нет"),
  },
];
const FilterTypeSchema = z.object({
  type: z.boolean().optional(),
});
export const Route = createFileRoute("/dashboard/statistics")({
  component: () => {
    const allPatients =
      useQueryClient().getQueryData<AxiosResponse<Patient[]>>("all_patients");
    const filterConfig = useForm<FormFilterConfig>();
    const [sorting, setSorting] = useState<SortingState>([]);

    const filterArray = useFieldArray({
      name: "filter",
      control: filterConfig.control,
    });
    const filterType = useForm<z.infer<typeof FilterTypeSchema>>({
      resolver: zodResolver(FilterTypeSchema),
      defaultValues: {
        type: true,
      },
    });
    const table = useReactTable({
      data: allPatients?.data ?? [],
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
      <div className="flex gap-6">
        <div className="w-full">
          <div className="flex gap-6">
            <div className="relative">
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
                className="pl-8"
              />
              <SearchIcon
                size={20}
                className="absolute left-2 top-1/2 -translate-y-1/2"
              />
            </div>
            <ExportToExcel
              dataSet={table
                .getFilteredRowModel()
                .rows.map(({ original }) => original)}
              fileName="Пациенты"
            />
          </div>
          <div className="block xl:hidden mt-2">
            <Drawer>
              <DrawerTrigger>
                <Button>Фильтр</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-6">
                  <div className="space-y-4">
                    <Button
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
                    <Form {...filterType}>
                      <form className="w-full ">
                        <FormField
                          control={filterType.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>
                                {field.value ? "Весь" : "Любой"}
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>

                  <ScrollArea className="h-96">
                    <div className="my-5 flex flex-col gap-4 p-3">
                      <Form {...filterConfig}>
                        {filterArray.fields?.map((field, index) => (
                          <div
                            key={field.id}
                            className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl space-y-4"
                          >
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
                                      <SelectItem value="gender">
                                        Пол
                                      </SelectItem>
                                      <SelectItem value="job_title">
                                        Положение
                                      </SelectItem>
                                      <SelectItem value="birthday">
                                        Дата рождения
                                      </SelectItem>
                                      <SelectItem value="age">
                                        Возраст
                                      </SelectItem>
                                      <SelectItem value="inhabited_locality">
                                        Населенный пункт
                                      </SelectItem>
                                      <SelectItem value="bp">БП</SelectItem>
                                      <SelectItem value="ischemia">
                                        Ишемия
                                      </SelectItem>
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
                  </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <ScrollArea className="xl:w-full md:w-full w-72 whitespace-nowrap">
            <div className="flex items-center justify-between gap-6 p-8">
              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <p className="pr-4 mr-4 h-full">Пол</p>
                <ul>
                  <li className="text-nowrap">
                    м:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => row.original.gender === "м")
                        .length
                    }
                  </li>
                  <li className="text-nowrap">
                    ж:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => row.original.gender !== "м")
                        .length
                    }
                  </li>
                </ul>
              </div>
              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <p className="pr-4 mr-4">Ишемия</p>
                <ul>
                  <li className="text-nowrap">
                    Да:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => row.original.ischemia)
                        .length
                    }
                  </li>
                  <li className="text-nowrap">
                    Нет:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => !row.original.ischemia)
                        .length
                    }
                  </li>
                </ul>
              </div>
              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <p className="pr-4 mr-4">БП</p>
                <ul>
                  <li className="text-nowrap">
                    Да:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => row.original.bp).length
                    }
                  </li>
                  <li className="text-nowrap">
                    Нет:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) =>!row.original.bp).length
                    }
                  </li>
                </ul>
              </div>

              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <p className="pr-4 mr-4">ДЭП</p>
                <ul>
                  <li className="text-nowrap">
                    Да:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => row.original.dep).length
                    }
                  </li>
                  <li className="text-nowrap">
                    Нет:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter((row) => !row.original.dep).length
                    }
                  </li>
                </ul>
              </div>
              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <p className="pr-4 mr-4">Населенный пункт</p>
                <ul>
                  <li className="text-nowrap">
                    Город:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter(
                          (row) => row.original.inhabited_locality === "Город"
                        ).length
                    }
                  </li>
                  <li className="text-nowrap">
                    Район:{" "}
                    {
                      table
                        .getFilteredRowModel()
                        .rows.filter(
                          (row) => row.original.inhabited_locality !== "Город"
                        ).length
                    }
                  </li>
                </ul>
              </div>
              <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl xl:w-1/3">
                <ul>
                  <li className="text-nowrap">Общее</li>
                  <li className="text-nowrap">
                    Всего: {table.getPreFilteredRowModel().rows.length}
                  </li>
                  <li className="text-nowrap">
                    Найдено: {table.getFilteredRowModel().rows.length}{" "}
                  </li>
                </ul>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <DataTablePagination table={table} />

          <div className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-none">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="p-2">
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
                        <TableCell key={cell.id} className="p-2">
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
          </div>
        </div>

        <div className="hidden xl:block">
          <div className="space-y-4">
            <Button
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
            <Form {...filterType}>
              <form className="w-full ">
                <FormField
                  control={filterType.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{field.value ? "Весь" : "Любой"}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="my-5 flex flex-col gap-4">
            <Form {...filterConfig}>
              {filterArray.fields?.map((field, index) => (
                <div
                  key={field.id}
                  className="shadow-neumorphism-box dark:shadow p-6 rounded-2xl space-y-4"
                >
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
                            <SelectItem value="gender">Пол</SelectItem>
                            <SelectItem value="job_title">Положение</SelectItem>
                            <SelectItem value="birthday">
                              Дата рождения
                            </SelectItem>
                            <SelectItem value="age">Возраст</SelectItem>
                            <SelectItem value="inhabited_locality">
                              Населенный пункт
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
        </div>
      </div>
    );
  },
});
