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
import {
  ErrorFallback,
  TableSkeleton,
} from "@/components/custom/TableFallback";

interface IDataTable<T> {
  table: ReactTable<T>;
  hasFixedSize?: boolean;
}

interface IProps<T> extends IDataTable<T>, ITableRender {}

// Generic here works because it only accept one prop. If it accepts other props here, TS will get confused and will result to type error.
const DataTable = <T,>({ table, hasFixedSize = true }: IDataTable<T>) => {
  return (
    <Table>
      <TableHeader className="bg-gray-100/70 dark:bg-gray-900/50">
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

const TableRender = <T,>({
  dataLength,
  isLoading,
  error: isError,
  search,
  ...rest
}: IProps<T>) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorFallback
        {...(search?.length > 0 && {
          description: "No results found for the given search query.",
        })}
      />
    );
  }

  if (dataLength === 0) {
    return (
      <ErrorFallback>
        {search?.length > 0 ? (
          <span>
            No results found for the given search{" "}
            <span className="font-medium text-black">{search}</span>
          </span>
        ) : (
          <span>
            No entries to show. Create a record or adjust the filter settings.
          </span>
        )}
      </ErrorFallback>
    );
  }

  return <DataTable {...rest} />;
};

export default TableRender;
