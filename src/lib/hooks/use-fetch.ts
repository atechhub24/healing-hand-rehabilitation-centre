import { useState, useEffect, useCallback } from "react";
import {
  ref,
  get,
  onValue,
  query,
  orderByChild,
  limitToFirst,
  limitToLast,
  Query,
  DataSnapshot,
} from "firebase/database";
import { database } from "../firebase";

interface UseFetchOptions<T> {
  filter?: {
    orderBy?: keyof T;
    limit?: number;
    limitToLast?: boolean;
  };
  transform?: (data: T | null) => T;
  nested?: boolean;
  realtime?: boolean; // Control whether to use real-time updates
  refetchOnMount?: boolean; // Control whether to refetch when component remounts
}

export default function useFetch<T extends object>(
  path: string,
  options?: UseFetchOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize options to prevent unnecessary rerenders
  const memoizedOptions = useCallback(
    () => ({
      filter: options?.filter,
      transform: options?.transform,
      nested: options?.nested,
      realtime: options?.realtime,
      refetchOnMount: options?.refetchOnMount,
    }),
    [
      options?.filter?.orderBy,
      options?.filter?.limit,
      options?.filter?.limitToLast,
      options?.transform,
      options?.nested,
      options?.realtime,
      options?.refetchOnMount,
    ]
  );

  // Create query based on options
  const createQuery = useCallback(() => {
    const opts = memoizedOptions();
    let dbQuery: Query;
    if (opts.filter) {
      const baseRef = ref(database, path);
      const { orderBy, limit, limitToLast: isLimitToLast } = opts.filter;

      if (orderBy) {
        dbQuery = query(baseRef, orderByChild(orderBy as string));

        if (limit) {
          dbQuery = query(
            dbQuery,
            isLimitToLast ? limitToLast(limit) : limitToFirst(limit)
          );
        }
      } else {
        dbQuery = baseRef;
      }
    } else {
      dbQuery = ref(database, path);
    }
    return dbQuery;
  }, [path, memoizedOptions]);

  // Function to process the data
  const processData = useCallback(
    (value: T | null) => {
      const opts = memoizedOptions();
      if (opts.nested && value) {
        const entries = Object.entries(value) as [string, Partial<T>][];
        value = entries.map(([key, val]) => ({
          id: key,
          ...val,
        })) as unknown as T;
      }

      if (opts.transform) {
        value = opts.transform(value);
      }

      return value;
    },
    [memoizedOptions]
  );

  // Function to fetch data once
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dbQuery = createQuery();
      const snapshot = await get(dbQuery);
      const value = processData(snapshot.val());
      setData(value);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [createQuery, processData]);

  // Manual refetch function that can be called by the consumer
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    const opts = memoizedOptions();
    const shouldFetch = opts.refetchOnMount ?? true;

    if (opts.realtime) {
      // Set up real-time listener
      const dbQuery = createQuery();
      const unsubscribe = onValue(
        dbQuery,
        (snapshot: DataSnapshot) => {
          const value = processData(snapshot.val());
          setData(value);
          setLoading(false);
          setError(null);
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else if (shouldFetch) {
      // Fetch once
      fetchData();
    }
  }, [path, memoizedOptions, createQuery, processData, fetchData]);

  return { data, loading, error, refetch } as const;
}
