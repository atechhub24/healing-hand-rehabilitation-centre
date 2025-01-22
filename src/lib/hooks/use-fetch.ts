import { useEffect, useReducer } from "react";
import { getArrFromNestedSnap, getArrFromSnap } from "@ashirbad/js-core";
import useMounted from "./use-mounted";
import { database } from "../firebase";
import { ref, onValue, DataSnapshot } from "firebase/database";

interface State<T> {
  data: T | null;
  isLoading: boolean;
}

type Action<T> = {
  type: "needRaw" | "needNested" | "needArray";
  payload: {
    snap: DataSnapshot;
  };
};

interface FetchOptions<T> {
  needRaw?: boolean;
  needNested?: boolean;
  filter?: (item: T extends any[] ? T[number] : T) => boolean;
  sort?: (
    a: T extends any[] ? T[number] : T,
    b: T extends any[] ? T[number] : T
  ) => number;
}

const dataReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
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
  options: FetchOptions<T> = {}
): [T | null, boolean] {
  const { needRaw = false, needNested = false, filter = () => true } = options;

  const [state, dispatch] = useReducer(dataReducer<T>, {
    data: null,
    isLoading: true,
  });

  const { mounted } = useMounted();

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
  }, [mounted, path]);

  // filter the data

  let filteredData = state.data;
  if (Array.isArray(state.data)) {
    filteredData = state.data.filter(filter) as T;
  } else if (typeof state.data === "object" && state.data !== null) {
    filteredData = Object.values(state.data).filter(filter) as T;
  }

  return [filteredData, state.isLoading];
}
