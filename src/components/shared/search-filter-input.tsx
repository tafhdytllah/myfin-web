import { Input } from "@/components/ui/input";

type SearchFilterInputProps = {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
};

export function SearchFilterInput({
  value,
  placeholder,
  onValueChange,
}: SearchFilterInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}
