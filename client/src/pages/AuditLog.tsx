import AuditLogTable from "@/components/custom/AuditLogTable";
import CustomInput from "@/components/custom/CustomInput";
import PaginationButtons from "@/components/custom/PaginationButton";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ListFilter,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import CustomDropdown from "@/components/custom/CustomDropdown";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";

const filter: AuditStatus[] = [
  "register",
  "update",
  "delete",
  "login",
  "logout",
];

const sortOptions: string[] = [
  "user",
  "email",
  "status",
  "date & time",
  "browser",
  "IP address",
  "added by",
];

const sortOptionMap: Record<string, keyof IAuditLog> = {
  user: "fullName",
  email: "emailAddress",
  status: "status",
  "date & time": "createdAt",
  browser: "browser",
  "IP address": "ipAddress",
  description: "description",
}; // [key to display]: key for sorting in server

const AuditLog = () => {
  const [page, setPage] = React.useState<number>(1);
  const [auditStatus, setAuditStatus] = React.useState<string>("Filter");
  const [search, setSearch] = React.useState<string>("");
  const debouncedSearch = useDebounce(search);
  const [sortKey, setSortKey] = React.useState<keyof IAuditLog | "Sort key">(
    "Sort key",
  );
  const [sortBy, setSortBy] = React.useState<string>("Sort by");

  const onSelectSortOption = React.useCallback((e?: Event | undefined) => {
    e?.preventDefault();
    const id = (e?.currentTarget as HTMLElement)?.id;
    const sortKey = sortOptionMap[id];
    setSortBy(id); // for displaying selected option
    setSortKey(sortKey); // setting sort by key to be sent to server
  }, []);

  const onInputRemoval = React.useCallback(() => {
    setSearch("");
  }, [setSearch]);

  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value); // for searching
    },
    [],
  );

  const queryKey = React.useMemo(
    () => ["audit-log", page, debouncedSearch, auditStatus, sortKey],
    [page, debouncedSearch, auditStatus, sortKey],
  );
  const { data, ...rest } = useFetchData<RecordQuery<IAuditLog>>(
    `/api/audit/retrieve/log?page=${page}&search=${debouncedSearch}&filter=${auditStatus}&sortKey=${sortKey}`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

  return (
    <div className="w-full max-w-[75rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-xl md:text-2xl font-medium">Audit Log</h1>
        <span className="text-gray-500 dark:text-gray-400">
          View and manage audit logs
        </span>
      </div>
      <Card className="p-0 border-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex mb-5 gap-x-2">
            <div>
              {/* Search Input */}
              <CustomInput
                icon={Search}
                placeholder="Search logs..."
                className="max-w-sm h-9 pl-9"
                iconClassName="top-2 left-2"
                value={search}
                onChange={onSearchChange}
                isSearch={debouncedSearch?.trim()?.length > 0}
                onInputRemoval={onInputRemoval}
              />
            </div>
            <div className="flex gap-x-2 items-center ml-auto [&_span]:hidden [&_span]:md:inline">
              {/* sort by dropdown */}
              <CustomDropdown
                state={sortBy}
                onSelect={onSelectSortOption}
                options={sortOptions}
                icon={ArrowUpDown}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Sort by"
              />

              {/* filter dropdown */}
              <CustomDropdown
                state={auditStatus}
                setState={setAuditStatus}
                options={filter}
                icon={ListFilter}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Filter by"
              />
              <Button className="px-3">
                <SquareArrowOutUpRight />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <AuditLogTable
            data={data?.record || []}
            search={search}
            {...rest}
          />
          <PaginationButtons
            setPage={setPage}
            hasNextPage={data?.hasNextPage ?? false}
            currentPage={page}
            totalPages={data?.totalPages ?? 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
