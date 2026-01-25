import { CustomToast } from "@/components/custom/CustomToast";

export const InsertFireArm = async (data: IFireArm) => {
  try {
    if (!data) throw new Error();
    // Check the firearm if it exist
    const response = await fetch("/api/police/insert/firearm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }); // Send request 
    if (!response.ok) {
      // Throw an error if the response isn't ok
      throw new Error("Failed to add firearm");
    }
    // Display a toast otherwise if it's success
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
