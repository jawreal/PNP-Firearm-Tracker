import { CustomToast } from "@/components/custom/CustomToast";

interface ProcessRegister extends IRegisterAdmin {
  description: string;
}

const RegisterAdmin = async (data: ProcessRegister) => {
  try {
    const response = await fetch("/api/admin/register", {
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
      description: "Admin is succesfully registered",
      status: "success",
    });
  } catch (error) {
    console;
    CustomToast({
      description: "Failed to register an admin user.",
      status: "error",
    });
  }
};

export default RegisterAdmin;
