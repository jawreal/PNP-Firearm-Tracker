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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

  const onSetTheme = () => setDarkMode((theme) => !theme);

  return (
    <nav className="w-full flex items-center py-4 px-4 md:px-10 lg:px-20 xl:px-32 border-b border-gray-300 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-950">
      <PageLogo />
      <ul className="w-full left-0 fixed md:static bottom-4 md:mr-6 px-3 flex justify-center md:justify-end">
        <div className="border md:border-none rounded-full flex space-x-4 5 md:justify-end p-3 md:p-0 shadow-sm md:shadow-none">
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
      <Button
        variant="outline"
        size="icon"
        className="ml-auto"
        onClick={onSetTheme}
      >
        {darkMode ? <Sun /> : <Moon />}
      </Button>
    </nav>
  );
};

export default Navbar;
