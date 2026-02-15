import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: AxiosRequestConfig) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const stringifiedOptions = JSON.stringify(options);
  
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.get<T>(url, options);
      setState({ data: response.data, isLoading: false, error: null });
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred";
      if (err instanceof AxiosError && err.response && err.response.data) {
        // Assuming backend returns error in { message: "Error" } format
        errorMessage = err.response.data.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setState({ data: null, isLoading: false, error: errorMessage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, stringifiedOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { ...state, refetch };
}
