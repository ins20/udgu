import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "./date-picker";
import { Input } from "./ui/input";
import DebouncedInput from "./debounce-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Control, useWatch } from "react-hook-form";
import { FormFilterConfig } from "@/types";

const ConditionField = ({
  control,
  index,
}: {
  control: Control<FormFilterConfig>;
  index: number;
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
              <Select
                onValueChange={(value) =>
                  field.onChange(Boolean(Number(value)))
                }
                defaultValue={field.value ? "1" : "0"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="м или ж" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">М</SelectItem>
                  <SelectItem value="">Ж</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {output[index]?.field === "inhabited_locality" && (
        <FormField
          name={`filter.${index}.value`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value) =>
                  field.onChange(Boolean(Number(value)))
                }
                defaultValue={field.value ? "1" : "0"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Город или деревня" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Город</SelectItem>
                  <SelectItem value="0">Район</SelectItem>
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
              <Select
                onValueChange={(value) =>
                  field.onChange(Boolean(Number(value)))
                }
                defaultValue={field.value ? "1" : "0"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Да или нет" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Да</SelectItem>
                  <SelectItem value="">Нет</SelectItem>
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
                value={String(field.value)}
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
                defaultValue={Number(field.value)}
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
export default ConditionField;
