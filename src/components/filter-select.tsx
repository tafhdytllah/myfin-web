import { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterSelectOption = {
  value: string;
  label: ReactNode;
};

type FilterSelectProps = {
  value: string;
  placeholder: string;
  displayValue?: ReactNode;
  options: FilterSelectOption[];
  onValueChange: (value: string) => void;
  className?: string;
};

export function FilterSelect({
  value,
  placeholder,
  displayValue,
  options,
  onValueChange,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue ?? "")}>
      <SelectTrigger className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
