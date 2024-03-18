import api from "@/axios";
import { Patient, User } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotebookPenIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import DebouncedInput from "@/components/debounce-input";
import { AxiosResponse } from "axios";
import { DataTablePagination } from "@/components/data-table-pagination";
import { PatientForm } from "../components/patient-form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { ExportToExcel } from "@/components/excel-export";
const columnHelper = createColumnHelper<Patient>();

const Patients = () => {
  const navigate = useNavigate({ from: "/dashboard" });
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");
  if (user?.data.role !== "therapist") navigate({ to: "/dashboard/profile" });
  const deletePatient = useMutation(
    (patient_id: string) =>
      api.delete(`v1/patient/delete`, {
        params: {
          patient_id,
        },
      }),
    {
      onSuccess: () => {
        patients.refetch();
        toast({
          title: "Успешно",
          description: "Пациент был удален",
        });
        setGlobalFilter("");
      },
    }
  );

  const columns = useMemo<ColumnDef<Patient, any>[]>(
    () => [
      columnHelper.accessor("full_name", {
        header: "ФИО",
      }),
      columnHelper.accessor("gender", {
        header: "Пол",
      }),
      columnHelper.accessor("birthday", {
        header: "Дата рождения",
        cell: (info) =>
          Date.parse(info.getValue())
            ? new Date(info.getValue()).toLocaleDateString("ru-RU")
            : info.getValue(),
      }),
      columnHelper.accessor("living_place", {
        header: "Место жительства",
      }),
      columnHelper.accessor("job_title", {
        header: "Должность",
      }),
      columnHelper.accessor("inhabited_locality", {
        header: "Населенный пункт",
      }),
      columnHelper.accessor("bp", {
        header: "Бп",
      }),
      columnHelper.accessor("ischemia", {
        header: "Ишемия",
      }),
      columnHelper.accessor("dep", {
        header: "Деп",
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="space-x-2">
              <Button
                size="icon"
                onClick={() =>
                  row.original.id &&
                  navigate({
                    to: `/dashboard/$patientId`,
                    params: {
                      patientId: row.original.id,
                    },
                  })
                }
              >
                <NotebookPenIcon />
              </Button>
              <Button
                size="icon"
                onClick={() => deletePatient.mutate(String(row.original.id))}
              >
                <XIcon />
              </Button>
            </div>
          );
        },
      }),
    ],
    []
  );
  const patients = useQuery<AxiosResponse<Patient[]>>(
    "patients",
    () =>
      api.get("v1/patient/get_all_by_therapist", {
        params: {
          limit: 6000,
        },
      }),
    {
      enabled: user?.data.role === "therapist",
    }
  );
  const allPatients =
    useQueryClient().getQueryData<AxiosResponse<Patient[]>>("all_patients");

  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data: user?.data.is_superuser
      ? allPatients?.data || []
      : patients.data?.data || [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="flex gap-6 justify-center flex-col xl:flex-row">
      <div className="xl:hidden block">
        <Drawer>
          <DrawerTrigger>
            <Button>Добавить пациента</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Новый пациент</DrawerTitle>
              <DrawerDescription>Заполните форму пациента</DrawerDescription>
            </DrawerHeader>
            <ScrollArea>
              <div className="h-96 p-6">
                <PatientForm />
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="rounded-2xl xl:w-10/12 p-6 shadow-neumorphism-box dark:shadow">
        <div className="flex gap-6">
          <div className="relative">
            <DebouncedInput
              debounce={500}
              placeholder="Поиск"
              className=" pl-8"
              onChange={(val) => setGlobalFilter(String(val))}
              value={globalFilter}
            />
            <SearchIcon
              size={20}
              className="absolute left-2 top-1/2 -translate-y-1/2"
            />
          </div>
          <ExportToExcel
            dataSet={table.getCoreRowModel().rows.map(({ original }) => original)}
            fileName="Пациенты"
          />
        </div>
        <DataTablePagination table={table} />
        <Table className="xl:w-full w-max border-separate border-spacing-y-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-2">
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "select-none flex items-center"
                              : "",
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:scale-[0.98] transition duration-200 hover:bg-transparent"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 first:rounded-l-full first:border-l-8 last:rounded-r-full last:border-r-8"
                    >
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
      <div className="xl:block hidden p-6 shadow-neumorphism-box dark:shadow rounded-2xl">
        <PatientForm />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Patients,
});
