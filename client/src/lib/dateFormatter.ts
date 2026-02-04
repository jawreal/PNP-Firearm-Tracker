import { parseISO } from "date-fns";

const FormatDate = (value: string | undefined) => {
  return typeof value === "string" ? parseISO(value) : value;
};

export default FormatDate;
