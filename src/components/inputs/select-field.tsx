"use client";

import { ReactNode } from "react";

import { FormFieldItem } from "@/components/form/form-field-item";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption<T extends string = string> = {
  label: ReactNode;
  value: T;
};

type SelectFieldProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  error?: string;
  description?: ReactNode;

  value?: T;

  options: SelectOption<T>[];

  onValueChange: (value: T) => void;
};

export function SelectField<T extends string = string>({
  label,
  placeholder,
  error,
  description,
  value,
  options,
  onValueChange,
}: SelectFieldProps<T>) {
  return (
    <FormFieldItem
      label={label}
      errors={error ? [{ message: error }] : []}
      description={description}
    >
      <Select
        value={value}
        onValueChange={(value) => onValueChange(value as T)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldItem>
  );
}