import { comparator } from "ramda";

const max = Number.MAX_SAFE_INTEGER;
const min = Number.MIN_SAFE_INTEGER;

export const sortByStringField = <T>(
  items: T[],
  getter: (item: T) => string | undefined,
  desc: boolean = false,
): T[] => {
  // undefined values are always at tail
  const byValue = (item: T) => {
    const val = getter(item);
    const length = val?.length || (desc ? min : max);

    return [length, val || ""];
  };

  return items.sort(
    comparator<T>((a, b) =>
      desc ? byValue(a) > byValue(b) : byValue(a) < byValue(b),
    ),
  );
};

export const sortByNumericField = <T>(
  items: T[],
  getter: (item: T) => number | undefined,
  desc: boolean = false,
): T[] => {
  const byValue = (item: T) => getter(item) || (desc ? min : max);

  return items.sort(
    comparator<T>((a, b) =>
      desc ? byValue(a) > byValue(b) : byValue(a) < byValue(b),
    ),
  );
};
