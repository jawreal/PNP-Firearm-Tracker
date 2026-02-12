import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, type Table as ReactTable } from "@tanstack/react-table";

interface IProps<T> {
  table: ReactTable<T>;
  hasFixedSize?: boolean;
}

// Generic here works because it only accept one prop. If it accepts other props here, TS will get confused and will result to type error.
const TableRender = <T,>({ table, hasFixedSize = true }: IProps<T>) => {
  return (
    <Table>
      <TableHeader className="bg-gray-200/50 dark:bg-gray-900/50">
        {/* Render table headers */}
        {table.getHeaderGroups().map((headerGroup, index: number) => (
          <TableRow
            id={headerGroup.id}
            key={index}
            className="[&_th]:text-gray-600 [&_th]:px-4 [&_th]:font-medium dark:[&_th]:text-gray-400 px-2 [&_tH:last-child]:text-end"
          >
            {headerGroup?.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {/* Render table rows */}
        {table.getCoreRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className={cn(
              "[&_td]:px-4 [&_td]:max-w-52 [&_td]:min-w-44 [&_td]:md:max-w-none [&_td]:md:min-w-0 [&_td:last-child]:text-end",
              hasFixedSize && "[&_td]:md:max-w-32 [&_td]:md:min-w-32",
            )}
          >
            {row.getVisibleCells().map((cell, index: number) => (
              <TableCell key={index}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableRender;
