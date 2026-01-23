import { toast } from "sonner";

interface CustomToastProps {
  description?: string;
  status?: "info" | "success" | "error";
  inLadingPage?: boolean;
}

export const CustomToast = ({
  description,
  status,
  inLadingPage = false,
}: CustomToastProps) => {
  if (!description || !status) return;
  toast[status](description, {
    className: `${
      inLadingPage
        ? "!bg-white !border-zinc-200 !text-zinc-500"
        : "!border-zinc-300 dark:!border-zinc-800 font-inter !bg-zinc-100 dark:!bg-zinc-950 !text-zinc-700 dark:!text-zinc-200"
    }`,
    duration: 3000,
    position: "bottom-right",
  });
};