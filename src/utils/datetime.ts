import { format, getTime } from "date-fns";

export const formatDateTime = (value?: string | Date): string => {
  if (!value) {
    return "";
  }

  return format(value, "yyyy-MM-dd HH:mm:ss");
};

export const formatDate = (value?: string | Date): string => {
  if (!value) {
    return "";
  }

  return format(value, "yyyy-MM-dd");
};

export const formatTime = (value?: string | Date): string => {
  if (!value) {
    return "";
  }

  return format(value, "HH:mm:ss");
};

export const timestamp = (value?: string | Date): number | undefined => {
  return value ? getTime(value) : undefined;
};
