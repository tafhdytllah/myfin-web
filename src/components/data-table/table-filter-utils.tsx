export function includesFilterValue(rowValue: unknown, filterValue: unknown) {
  if (!filterValue || filterValue === "all") {
    return true;
  }

  if (Array.isArray(filterValue)) {
    return filterValue.length === 0 || filterValue.includes(rowValue);
  }

  return rowValue === filterValue;
}