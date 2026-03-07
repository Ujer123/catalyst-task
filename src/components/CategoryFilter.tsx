"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CategoryFilterProps } from "@/types";

function buildCategoryUrl(searchParams: URLSearchParams, category?: string) {
  const params = new URLSearchParams(searchParams);
  if (category) params.set("category", category);
  else params.delete("category");
  const q = searchParams.get("q");
  if (q) params.set("q", q);
  else params.delete("q");
  return `/?${params.toString()}`;
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md sticky top-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col max-w-sm">
      <h3 className="font-bold text-xl text-black dark:text-white mb-6">Categories</h3>
      
      <div className="space-y-2">
        <Link 
          href={buildCategoryUrl(searchParams)}
          className={`block p-3 rounded-xl font-semibold transition-colors ${
            !currentCategory 
              ? "bg-blue-100 text-blue-800" 
              : "text-gray-700 dark:text-gray-400 hover:bg-gray-100"
          }`}
        >
          All Products
        </Link>

        {categories.map((category) => (
          <Link
            key={category.slug}
            href={buildCategoryUrl(searchParams, category.slug)}
            className={`block p-3 rounded-xl transition-colors capitalize ${
              currentCategory === category.slug
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "text-gray-700 dark:text-gray-400 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
