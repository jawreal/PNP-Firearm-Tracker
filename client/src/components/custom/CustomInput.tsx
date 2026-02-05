import { memo, type InputHTMLAttributes, useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
  iconClassName?: string;
  isPassword?: boolean;
};

const CustomInput = (props: CustomInputProps) => {
  const {
    icon: Icon,
    isPassword = false,
    className,
    iconClassName,
    ...rest
  } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onShowPassword = useCallback(() => {
    setShowPassword((show) => !show);
  }, []);

  return (
    <div className="w-full relative">
      {/* Icon Positioning */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-zinc-400">
        <Icon size={20} className={cn("text-gray-400", iconClassName)} />
      </div>
      {/* Spread other input props/attributes */}
      <Input
        {...rest}
        type={!isPassword ? "text" : !showPassword ? "password" : "text"}
        className={cn(
          "h-10 pl-10 rounded-lg shadow-none",
          className && className,
        )}
      />
      {isPassword && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onShowPassword}
          className="absolute right-2 top-1 [&_svg]:size-[20px] text-gray-500"
        >
          {!showPassword ? <Eye /> : <EyeOff />}
        </Button>
      )}{" "}
      {/* Password Toggle Button */}
    </div>
  );
};

export default memo(CustomInput);
