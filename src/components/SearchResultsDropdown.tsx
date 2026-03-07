"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface SearchResultsDropdownProps {
  results: Product[];
  isLoading: boolean;
  searchQuery: string;
  onSelect: () => void;
  preservedParams?: string;
}

export default function SearchResultsDropdown({
  results,
  isLoading,
  searchQuery,
  onSelect,
  preservedParams = "",
}: SearchResultsDropdownProps) {
  const queryString = preservedParams
    ? `${preservedParams}&q=${encodeURIComponent(searchQuery)}`
    : `q=${encodeURIComponent(searchQuery)}&skip=0`;
  const baseHref = `/?${queryString}`;
  if (!searchQuery) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {isLoading && (
        <div className="p-4 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-700"></div>
          <span className="ml-2">Searching...</span>
        </div>
      )}

      {!isLoading && results.length === 0 && searchQuery.length >= 2 && (
        <div className="p-4 text-center text-gray-500">
          No products found for `{searchQuery}`
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <ul>
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={baseHref}
                onClick={onSelect}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
className="object-cover rounded"
                  sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-sm font-semibold text-cyan-700">
                  ${product.price}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <Link
            href={baseHref}
            onClick={onSelect}
            className="block text-center text-sm text-cyan-700 hover:text-cyan-800 font-medium"
          >
            View all results
          </Link>
        </div>
      )}
    </div>
  );
}

