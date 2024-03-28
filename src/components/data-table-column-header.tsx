import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  // if (!column.getCanSort()) {
  //   return <div className={cn(className)}>{title}</div>;
  // }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent rounded-2xl"
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
