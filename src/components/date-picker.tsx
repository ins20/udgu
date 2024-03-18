import { Calendar as CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Input } from "./ui/input";

export function DatePicker({
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
