import AdminUsersTable from "@/components/custom/AdminUsersTable";

const mockupData: IAdminUsers[] = [
  {
    fullName: "John Doe",
    userName: "@jd_123",
    createdAt: "2024-01-14T11:05:00Z",
    role: "admin",
    description: "added by **@mcruz-admin**",
  },
];

const Admins = () => {
  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Admins</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all admin users
        </span>
      </div>
      <AdminUsersTable data={mockupData} />
    </div>
  );
};

export default Admins;
