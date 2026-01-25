import PageLogo from "@/components/custom/PageLogo"
import { Button } from "@/components/ui/button";
import useDarkMode from "@/hooks/useDarkMode";
import {
  Moon,
  Sun,
  LayoutDashboard,
  ShieldCheck,
  FileSearch,
  UserCog,
  type LucideIcon,
} from "lucide-react";
//import { Link } from "react-router-dom";

interface NavLinks {
  name: string;
  icon: LucideIcon;
  link: string;
}

const navLinks: NavLinks[] = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    link: "dashboard", 
  },
  {
    name: "Firearms",
    icon: ShieldCheck,
    link: "firearm/registry", 
  },
  {
    name: "Audit",
    icon: FileSearch,
    link: "audit", 
  },
  {
    name: "Admins",
    icon: UserCog,
    link: "manage/admin", 
  },
]

const Navbar = () => {
  const [ darkMode, setDarkMode ] = useDarkMode();
  
  const onSetTheme = () => setDarkMode(theme => !theme)
  
  return (
    <nav className="w-full flex items-center py-4 px-4 md:px-10 lg:px-20 xl:px-32 border-b border-gray-300 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-950">
      <ul className="w-full hidden md:flex space-x-6 items-center justify-end mr-6">
      <PageLogo />
       {navLinks?.map((item: NavLinks, idx: number) => {
         return (<li key={idx}>
           <a href={item?.link ?? "#"} className="flex text-sm">
           {item?.name ?? "No name found"}
           </a>
         </li>)
       })} 
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
  )
};

export default Navbar;