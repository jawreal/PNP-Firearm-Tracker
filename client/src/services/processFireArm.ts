import { CustomToast } from "@/components/custom/CustomToast";

export const ProcessFireArm = async (
  data: IFireArm,
  isEdit: boolean = false,
): Promise<{ success: boolean }> => {
  try {
    if (!data) throw new Error();
    // Check the firearm if it exist
    const response = await fetch(
      `/api/firearm/${isEdit ? "update" : "insert"}/registry`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    ); // Send request
    if (!response.ok) {
      // Throw an error if the response isn't ok
      throw new Error(`Failed to ${isEdit ? "update" : "add"} firearm`);
    }
    // Display a toast otherwise if it's success
    CustomToast({
      description: `${isEdit ? "Registering" : "Updating"} firearm success!`,
      status: "success",
    });
    return { success: true };
  } catch (error) {
    CustomToast({
      description: `Failed to ${isEdit ? "update" : "register"} firearm!`,
      status: "error",
    });
    console.error(error);
    return { success: false };
  }
};
