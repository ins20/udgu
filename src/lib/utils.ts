import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dateOfBirth: string) {
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

export function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

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

export type StringRule = keyof typeof rulesString;
export type NumberRule = keyof typeof rulesNumber;
export const validateValue = (
  value: string | number | Date | boolean,
  initialValue: string | number | Date | boolean,
  rule: StringRule | NumberRule
) => {
  if (typeof value === "string" && typeof initialValue === "string") {
    return rulesString[rule as StringRule](value, initialValue);
  }

  if (typeof value === "number" && typeof initialValue === "number") {
    return rulesNumber[rule as NumberRule](value, initialValue);
  }
  if (typeof value === "boolean" && typeof initialValue === "boolean") {
    return value === initialValue;
  }
  if (value instanceof Date && initialValue instanceof Date) {
    return rulesNumber[rule as NumberRule](
      value.getTime(),
      initialValue.getTime()
    );
  }

  return false;
};
