import { CustomToast } from "@/components/custom/CustomToast";

interface IProcess {
  admin_id: string;
  status: "active" | "deactivated";
  deactivationReason?: string;
}

const ProcessStatus = async (data: IProcess) => {
  try {
    const response = await fetch("/api/admin/process/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error();
    }

    CustomToast({
      description: `Account has been successfully ${data?.status === "active" ? "activated" : "deactivated"}`,
      status: "success",
    });
  } catch (error) {
    CustomToast({
      description: "Internal server error. Please try again.",
      status: "error",
    });
  }
};

export default ProcessStatus;
