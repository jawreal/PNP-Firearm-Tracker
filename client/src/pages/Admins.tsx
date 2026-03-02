import AdminUsersTable from "@/components/custom/AdminUsersTable";
import CustomInput from "@/components/custom/CustomInput";
import { ArrowUpDown, ListFilter, Plus, Search } from "lucide-react";
import CustomDropdown from "@/components/custom/CustomDropdown";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RegisterAdmin from "@/components/custom/RegisterAdmin";
import PaginationButtons from "@/components/custom/PaginationButton";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";

const ACCOUNT_STATUS: AdminAccStatus[] = ["deactivated", "active"];

const SORT_OPTIONS: string[] = [
  "user",
  "username",
  "created at",
  "status",
  "description",
];

const SORT_OPTIONS_MAP: Record<string, keyof IAdminUsers> = {
  user: "firstName",
  username: "userName",
  status: "status",
  "created at": "createdAt",
  role: "role",
  description: "description",
}; // [key to display]: key for sorting in server

const Admins = () => {
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const debouncedSearch = useDebounce(search);
  const [auditStatus, setAuditStatus] = React.useState<string>("Filter");
  const [openRegisterAdmin, setOpenRegisterAdmin] =
    React.useState<boolean>(false);
  const [sortKey, setSortKey] = React.useState<string>("Sort by");
  const [sortBy, setSortBy] = React.useState<string>("Sort by");

  const onSelectSortOption = React.useCallback((e?: Event | undefined) => {
    e?.preventDefault();
    const id = (e?.currentTarget as HTMLElement)?.id;
    const sortKey = SORT_OPTIONS_MAP[id];
    setSortBy(id); // for displaying selected option
    setSortKey(sortKey); // setting sort by key to be sent to server
  }, []);

  const onOpenRegisterAdmin = () => {
    setOpenRegisterAdmin(true);
  };
  
  const onInputRemoval = React.useCallback(() => {
    setSearch("")
  }, [setSearch])


  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value); // for searching
    },
    [],
  );

  const queryKey = React.useMemo(
    () => ["admin-records", page, debouncedSearch, auditStatus, sortKey],
    [page, debouncedSearch, auditStatus, sortKey],
  );
  const { data, ...rest } = useFetchData<RecordQuery<IAdminUsers>>(
    `/api/admin/retrieve/registry?page=${page}&search=${debouncedSearch}&filter=${auditStatus}&sortKey=${sortKey}`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

  return (
    <div className="w-full max-w-[65rem] gap-y-5 flex flex-col pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-xl md:text-2xl font-medium">Admins</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all admin users
        </span>
      </div>
      <RegisterAdmin
        open={openRegisterAdmin}
        onOpenChange={setOpenRegisterAdmin}
      />
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="w-full flex gap-x-2 mb-5">
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
                options={SORT_OPTIONS}
                icon={ArrowUpDown}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Sort by"
              />

              {/* filter dropdown */}
              <CustomDropdown
                state={auditStatus}
                setState={setAuditStatus}
                options={ACCOUNT_STATUS}
                icon={ListFilter}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Filter by"
              />
              <Button className="px-3" onClick={onOpenRegisterAdmin}>
                <Plus />
                <span>Register Admin</span>
              </Button>
            </div>
          </div>
          <AdminUsersTable
            data={data?.record || []}
            {...rest}
            search={search}
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

export default Admins;
