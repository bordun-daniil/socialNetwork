import {
  useState,
  useEffect,
  ChangeEvent,
  RefObject,
  useRef,
  useCallback,
} from "react";

export const useInput = () => {
  const [value, setValue] = useState("");

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);
      },
    },
  };
};

export const usePagination = (ref: RefObject<HTMLElement>) => {
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const onScroll = () => {
      if (node)
        setIsAtPageBottom(
          node.offsetHeight <= window.scrollY + window.innerHeight
        );
    };

    window.addEventListener("scroll", onScroll);

    return function () {
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return isAtPageBottom;
};

export const useDebounce = (callback: any, delay: number) => {
  const timer = useRef<any>();

  const debouncedCallback = useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};
