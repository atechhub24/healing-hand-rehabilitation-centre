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
  type: "needArray" | "needNested" | "raw";
  payload: {
    snap: DataSnapshot;
  };
};

interface FetchOptions<T> {
  needArray?: boolean;
  needNested?: boolean;
  filter?: (item: T extends any[] ? T[number] : T) => boolean;
  sort?: (
    a: T extends any[] ? T[number] : T,
    b: T extends any[] ? T[number] : T
  ) => number;
}

/**
 * dataReducer is a reducer function that takes in a state and an action and
 * returns a new state. The state is expected to be an object with a data
 * property and an isLoading property. The data property is expected to be
 * null or an array of objects. The isLoading property is expected to be a
 * boolean.
 *
 * The action is expected to be an object with a type property and a payload
 * property. The type property is expected to be one of "needArray", "needNested",
 * or "raw". The payload property is expected to be an object with a snap
 * property. The snap property is expected to be a Firebase Realtime Database
 * DataSnapshot.
 *
 * If the type is "needArray", the reducer will return a new state with the data
 * property set to the result of calling getArrFromSnap with the action.payload.snap.
 * If the type is "needNested", the reducer will return a new state with the data
 * property set to the result of calling getArrFromNestedSnap with the
 * action.payload.snap.
 *
 * If the type is "raw", the reducer will return a new state with the data
 * property set to the result of calling val() on the action.payload.snap.
 *
 * In all cases, the isLoading property of the new state is set to false.
 *
 * If the type is not one of "needArray", "needNested", or "raw", the reducer will
 * return the original state.
 */
const dataReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "needArray":
      return {
        data: getArrFromSnap(action.payload.snap) as T,
        isLoading: false,
      };
    case "needNested":
      return {
        data: getArrFromNestedSnap(action.payload.snap) as T,
        isLoading: false,
      };
    case "raw":
      return {
        data: action.payload.snap.val() as T,
        isLoading: false,
      };
    default:
      return state;
  }
};

/**
 * useDB is a React hook that returns an array of two elements: the data and a boolean
 * indicating whether the data is loading. The data is an array of objects if the
 * needArray option is true, or an object if the needNested option is true, or the
 * result of calling val() on the DataSnapshot if neither option is true. The data
 * is filtered and sorted according to the filter and sort options, respectively.
 *
 * @param {string} path The path in the Realtime Database to retrieve data from
 * @param {object} options An object with the following optional properties:
 *   - needArray: a boolean indicating whether to return an array of objects
 *   - needNested: a boolean indicating whether to return an object
 *   - filter: a function that takes an object and returns a boolean indicating
 *     whether to include the object in the result
 *   - sort: a function that takes two objects and returns a number indicating
 *     whether to sort the objects in ascending or descending order
 * @returns {array} An array of two elements: the data and a boolean indicating
 *   whether the data is loading
 */
export default function useFetch<T>(
  path: string,
  options: FetchOptions<T> = {}
): [T | null, boolean] {
  const needArray = options.needArray !== false;
  const needNested = !!options.needNested;
  const filter = options.filter || (() => true);
  const sort = options.sort || ((a: T, b: T) => 0);

  const [state, dispatch] = useReducer(dataReducer<T>, {
    data: null,
    isLoading: true,
  });

  const { mounted } = useMounted();

  useEffect(() => {
    const dbRef = ref(database, path);
    const unsubscribe = onValue(dbRef, (snap) => {
      if (mounted.current) {
        let type: "needArray" | "needNested" | "raw" = "raw";
        if (needNested) type = "needNested";
        if (!needNested && needArray) type = "needArray";
        dispatch({ type, payload: { snap } });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [mounted, needArray, needNested, path]);

  // First apply filter, then apply sort
  let processedData = state.data;
  if ((needArray || needNested) && Array.isArray(processedData)) {
    processedData = processedData
      ?.filter(filter)
      ?.sort(sort)
      ?.map((item, i) => ({ ...item, sl: i + 1 })) as T;
  }

  return [processedData, state.isLoading];
}
