export const RetrieveFireArm = async (): Promise<IFireArm[] | undefined> => {
  const response = await fetch("/api/firearm/retrieve/record");
  if (!response.ok) {
    throw new Error("Failed to retrieve the record");
  }
  const result = await response.json();
  return result as IFireArm[];
};
