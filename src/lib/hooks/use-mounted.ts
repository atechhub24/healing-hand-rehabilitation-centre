import { useEffect, useRef, RefObject } from "react";

/**
 * useMounted is a custom hook that tracks the mounted state of a component.
 * It returns a ref object with a boolean value indicating whether the component is mounted.
 *
 * @returns {Object} An object containing the mounted ref
 */
const useMounted = (): { mounted: RefObject<boolean> } => {
  const mounted = useRef<boolean>(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return {
    mounted,
  };
};

export default useMounted;
