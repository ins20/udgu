import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 1000,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      variant={"neumorphism"}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
export function DebouncedTextarea({
  value: initialValue,
  onChange,
  debounce = 1000,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Textarea
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
export default DebouncedInput;
