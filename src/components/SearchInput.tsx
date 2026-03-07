"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import SearchResultsDropdown from "./SearchResultsDropdown";
import { Product } from "@/types";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { debouncedValue, isLoading, handleSearch, setIsLoading } = useDebouncedSearch({
    delay: 300,
    minChars: 2,
  });

  const currentQ = searchParams.get("q") || "";


  useEffect(() => {
    async function fetchSearchResults() {
      if (!debouncedValue) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/products?q=${encodeURIComponent(debouncedValue)}&limit=5&skip=0`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [debouncedValue, setIsLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
    setIsDropdownOpen(value.length >= 2);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    const params = new URLSearchParams(searchParams.toString());

    if (searchValue && searchValue.trim()) {
      params.set("q", searchValue.trim());
      params.set("skip", "0");
    } else {
      params.delete("q");
      params.set("skip", "0");
    }

    router.push(`/?${params.toString()}`);
    setIsDropdownOpen(false);
  };

  const handleSelectResult = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="search"
          id="search-input"
          placeholder="Search products..."
          defaultValue={currentQ}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.length >= 2) {
              setIsDropdownOpen(true);
            }
          }}
          autoComplete="off"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 w-48 lg:w-64"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors"
        >
          Search
        </button>
      </form>

      {isDropdownOpen && (debouncedValue || isLoading) && (
        <SearchResultsDropdown
          results={results}
          isLoading={isLoading}
          searchQuery={debouncedValue || inputValue}
          onSelect={handleSelectResult}
        />
      )}
    </div>
  );
}

