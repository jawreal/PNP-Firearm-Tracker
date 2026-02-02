import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, type Table as ReactTable } from "@tanstack/react-table";

interface IProps<T> {
  table: ReactTable<T>;
}

const TableRender = <T,>({ table }: IProps<T>) => {
  return (
    <Table>
      <TableHeader className="bg-gray-200/50 dark:bg-gray-900/50">
        {/* Render table headers */}
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            id={headerGroup.id}
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
            className="[&_td]:px-4 [&_td]:max-w-52 [&_td]:min-w-44 [&_td]:md:max-w-32 [&_td]:md:min-w-32 [&_td:last-child]:text-end"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell>
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
