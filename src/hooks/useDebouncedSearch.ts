"use client";

import { useState, useEffect, useCallback } from "react";

export function useDebouncedSearch({ delay = 300, minChars = 2 } = {}) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length >= minChars) {
        setDebouncedValue(inputValue);
      } else {
        setDebouncedValue("");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay, minChars]);

  const handleSearch = useCallback((value: string) => {
    setInputValue(value);
    setIsLoading(value.length >= minChars);
  }, [minChars]);

  return {
    debouncedValue,
    isLoading,
    handleSearch,
    setIsLoading,
  };
}
