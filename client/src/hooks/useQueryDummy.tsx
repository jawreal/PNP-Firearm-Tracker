import { useIsFetching } from "@tanstack/react-query";

export const useQueryDummy = (queryKey: string) => {
  const isFetching = useIsFetching({ queryKey: [queryKey] });
  return { isLoading: isFetching > 0 };
};

// this is a non functional useQuery dummy.
// its main purpose is to get the loading state of an specific query if the query is defined in different component. 