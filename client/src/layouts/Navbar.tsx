import PageLogo from "@/components/custom/PageLogo";
import { Button } from "@/components/ui/button";
import useDarkMode from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  LayoutDashboard,
  ShieldCheck,
  FileSearch,
  UserCog,
  type LucideIcon,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import LogoutDialog from "@/components/custom/LogoutDialog";

interface NavLinks {
  name: string;
  icon: LucideIcon;
  link: string;
}

const navLinks: NavLinks[] = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    link: "overview/dashboard",
  },
  {
    name: "Firearms",
    icon: ShieldCheck,
    link: "firearms/registry",
  },
  {
    name: "Audit",
    icon: FileSearch,
    link: "audit/log",
  },
  {
    name: "Admins",
    icon: UserCog,
    link: "manage/admins",
  },
];

const Navbar = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const location = useLocation();
  const [openLogout, setOpenLogout] = useState<boolean>(false);

  const onSetTheme = () => setDarkMode((theme) => !theme);

  const handleOpenLogout = () => {
    setOpenLogout((prev) => !prev);
  };

  return (
    <nav className="w-full flex items-center py-4 px-4 md:px-10 lg:px-20 xl:px-32 border-b border-gray-300 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-950">
      <PageLogo />
      <LogoutDialog open={openLogout} onOpenChange={handleOpenLogout} />
      <ul className="w-full left-0 fixed md:static bottom-4 md:mr-4 px-3 flex justify-center md:justify-end">
        <div className="bg-white dark:bg-gray-950 md:bg-inherit md:dark:bg-inherit border md:border-none rounded-full flex space-x-3 md:justify-end p-3 md:p-0 shadow-sm md:shadow-none">
          {navLinks?.map((item: NavLinks, idx: number) => {
            return (
              <li key={idx} className="md:flex-0">
                <Link
                  to={item?.link ?? "#"}
                  className={cn(
                    "w-full flex justify-center gap-x-2 items-center text-sm px-3 py-2 rounded-full gap-y-1 text-gray-500 dark:text-gray-400",
                    location.pathname.includes(item?.link) &&
                      "bg-indigo-600 text-white dark:text-white md:border-none md:bg-inherit md:text-primary",
                  )}
                >
                  {/* If path contains the link's name, bg would change showing it as active but it only applies on small devices */}
                  {/* It will only show a highlighted text in bigger device */}
                  <item.icon size={20} className="block md:hidden" />
                  <span
                    className={cn(
                      "hidden md:block",
                      location.pathname.includes(item?.link) &&
                        "block font-medium",
                    )}
                  >
                    {item?.name ?? "No name found"}
                  </span>
                </Link>
              </li>
            );
          })}
        </div>
      </ul>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto p-0 flex justify-center items-center active:outline-none active:ring-0 active:border-0 hover:outline-none hover:ring-0 hover:border-0"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src="https://api.dicebear.com/9.x/glass/svg?seed=Freiren"
                alt="profile"
                className="rounded-full"
              />
              <AvatarFallback className="w-8 h-8 rounded-full"></AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 p-2 mr-4 md:mr-0">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarImage
                    src="https://api.dicebear.com/9.x/glass/svg?seed=Freiren"
                    alt="profile"
                  />
                  <AvatarFallback className="w-8 h-8 rounded-full"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Jorell Relleve</span>
                  <span className="text-xs text-indigo-700 dark:text-indigo-400 flex items-center gap-x-2">
                    @jawreal
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              {darkMode ? <Moon /> : <Sun />}
              Dark Mode
              <Switch
                checked={darkMode}
                onCheckedChange={onSetTheme}
                className="ml-auto"
              />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenLogout} className="!text-sm">
              <LogOut className="!size-[16px]" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup></DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
