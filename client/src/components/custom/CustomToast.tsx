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
        ? "!bg-white !border-gray-200 !text-gray-500"
        : "!border-gray-300 dark:!border-gray-800 font-inter !bg-gray-100 dark:!bg-gray-950 !text-gray-700 dark:!text-gray-200"
    }`,
    duration: 3000,
    position: "bottom-right",
  });
};