import type { IFireArm } from "@/components/custom/QRCodeDialog";
import { CustomToast } from "@/components/custom/CustomToast";

export const InsertFirearm = async (data: IFireArm) => {
  try {
    if (!data) throw new Error();
    const response = await fetch("/api/police//insert/firearm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to add firearm");
    }
    CustomToast({
      description: "Registering firearm success!",
      status: "success",
    });
  } catch (error) {
    CustomToast({
      description: "Failed to register firearm!",
      status: "success",
    });
    console.error(error);
  }
};
