import { useCallback, useEffect, useReducer, useRef } from "react";
import { getArrFromNestedSnap, getArrFromSnap } from "@ashirbad/js-core";
import useMounted from "./use-mounted";
import { database } from "../firebase";
import { ref, onValue, DataSnapshot, get } from "firebase/database";

interface State<T> {
  data: T | null;
  isLoading: boolean;
}

type Action = {
  type: "needRaw" | "needNested" | "needArray";
  payload: {
    snap: DataSnapshot;
  };
};

interface FetchOptions {
  needRaw?: boolean;
  needNested?: boolean;
  filter?: (item: unknown) => boolean;
  sort?: (a: unknown, b: unknown) => number;
}

const dataReducer = <T>(state: State<T>, action: Action): State<T> => {
  switch (action.type) {
    case "needNested":
      return {
        data: getArrFromNestedSnap(action.payload.snap) as T,
        isLoading: false,
      };
    case "needRaw":
      return {
        data: action.payload.snap.val() as T,
        isLoading: false,
      };
    case "needArray":
      return {
        data: getArrFromSnap(action.payload.snap) as T,
        isLoading: false,
      };
  }
};

export default function useFetch<T>(
  path: string,
  options: FetchOptions = {}
): [T | null, boolean, () => Promise<void>] {
  const { needRaw = false, needNested = false, filter = () => true } = options;

  const [state, dispatch] = useReducer(dataReducer<T>, {
    data: null,
    isLoading: true,
  });

  const { mounted } = useMounted();
  const pathRef = useRef(path);

  // Update path ref when path changes
  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  // Function to manually refetch data
  const refetch = useCallback(async () => {
    try {
      const dbRef = ref(database, pathRef.current);
      const snapshot = await get(dbRef);

      if (mounted.current) {
        dispatch({
          type: needRaw ? "needRaw" : needNested ? "needNested" : "needArray",
          payload: { snap: snapshot },
        });
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  }, [mounted, needRaw, needNested]);

  useEffect(() => {
    const dbRef = ref(database, path);
    const unsubscribe = onValue(dbRef, (snap) => {
      if (mounted.current) {
        dispatch({
          type: needRaw ? "needRaw" : needNested ? "needNested" : "needArray",
          payload: { snap },
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [mounted, needNested, needRaw, path]);

  // filter the data
  let filteredData = state.data;
  if (Array.isArray(state.data)) {
    filteredData = state.data.filter(filter) as T;
  } else if (typeof state.data === "object" && state.data !== null) {
    filteredData = state.data;
  }

  return [filteredData, state.isLoading, refetch];
}
