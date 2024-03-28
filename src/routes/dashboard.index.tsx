import api from "@/axios";
import { Patient, User } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import {  useQuery, useQueryClient } from "react-query";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import DebouncedInput from "@/components/debounce-input";
import { AxiosResponse } from "axios";
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
import { ExportToExcel } from "@/components/excel-export";

import { useVirtualizer } from "@tanstack/react-virtual";
const columnHelper = createColumnHelper<Patient>();

const Patients = () => {
  const navigate = useNavigate({ from: "/dashboard" });
  const user = useQueryClient().getQueryData<AxiosResponse<User>>("user");
  const allPatients = useQuery<AxiosResponse<Patient[]>>("all_patients", () =>
    api.get("patient/get_all", {
      params: {
        limit: 6000,
      },
    })
  );
  const [data, setData] = useState<Patient[]>([]);
  if (user?.data.role !== "therapist") navigate({ to: "/dashboard/profile" });

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
        header: "Положение",
      }),
      columnHelper.accessor("inhabited_locality", {
        header: "Населенный пункт",
      }),
      columnHelper.accessor("bp", {
        header: "Бп",
        cell: ({ row }) => (row.original.bp ? "Да" : "Нет"),
      }),
      columnHelper.accessor("ischemia", {
        header: "Ишемия",
        cell: ({ row }) => (row.original.ischemia ? "Да" : "Нет"),
      }),
      columnHelper.accessor("dep", {
        header: "Дэп",
        cell: ({ row }) => (row.original.dep ? "Да" : "Нет"),
      }),
    ],
    []
  );
  const patients = useQuery<AxiosResponse<Patient[]>>(
    "patients",
    () =>
      api.get("patient/get_all_by_therapist", {
        params: {
          limit: 6000,
        },
      }),
    {
      enabled: user?.data.role === "therapist",
      onSuccess: (data) => {
        setData(data.data);
      },
    }
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const { rows } = table.getRowModel();

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
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

      <div className="rounded-2xl xl:w-10/12 p-6 shadow-neumorphism-box dark:shadow ">
        <div className="flex gap-6 mb-2">
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
            dataSet={table
              .getCoreRowModel()
              .rows.map(({ original }) => original)}
            fileName="Пациенты"
          />
          {user?.data.is_superuser && allPatients.data?.data && (
            <Button onClick={() => setData(allPatients.data?.data)}>
              Все пациенты
            </Button>
          )}
          {user?.data.is_superuser && patients.data?.data && (
            <Button onClick={() => setData(patients.data?.data)}>
              Мои пациенты
            </Button>
          )}
        </div>

        <div
          ref={tableContainerRef}
          style={{
            overflow: "auto", //our scrollable table container
            position: "relative", //needed for sticky header
            height: "800px", //should be a fixed height
          }}
        >
          {" "}
          <table style={{ display: "grid" }}>
            <thead
              style={{
                display: "grid",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
              className="bg-[#EBEFF3] dark:bg-slate-900"
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-none"
                  style={{ display: "flex", width: "100%" }}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="p-2"
                        style={{
                          display: "flex",
                          width: header.getSize(),
                        }}
                      >
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
            </thead>
            <TableBody
              style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                position: "relative", //needed for absolute positioning of rows
              }}
            >
              {table.getRowModel().rows?.length ? (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<Patient>;
                  return (
                    <TableRow
                      data-index={virtualRow.index} //needed for dynamic row height measurement
                      ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                      key={row.id}
                      onClick={() =>
                        row.original.id &&
                        navigate({
                          to: `/dashboard/$patientId`,
                          params: {
                            patientId: row.original.id,
                          },
                        })
                      }
                      className="cursor-pointer"
                      style={{
                        display: "flex",
                        position: "absolute",
                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                        width: "100%",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              display: "flex",
                              width: cell.column.getSize(),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>Нет данных</TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
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
