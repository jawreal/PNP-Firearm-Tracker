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
      <Icon
        size={20}
        className={cn(
          "absolute left-3 top-3 text-zinc-500",
          iconClassName && iconClassName,
        )}
      />
      <Input
        {...rest}
        type={!isPassword ? "text" : !showPassword ? "password" : "text"}
        className={cn(
          "h-11 pl-10 rounded-lg shadow-none",
          className && className,
        )}
      />
      {isPassword && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onShowPassword}
          className="absolute right-2 top-1 [&_svg]:size-[20px] text-zinc-500"
        >
          {!showPassword ? <Eye /> : <EyeOff />}
        </Button>
      )}
    </div>
  );
};

export default memo(CustomInput);
