import { useQuery, keepPreviousData, type QueryKey } from "@tanstack/react-query";

export default function useFetchData<T>(
  url: string,
  queryKey: QueryKey,
  showPlaceholder: boolean = false,
) {
  const result = useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
    ...(showPlaceholder && { placeholderData: keepPreviousData }),
  });

  return result;
}
