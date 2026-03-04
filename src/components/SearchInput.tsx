"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const currentQ = searchParams.get("q") || "";

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        name="search"
        id="search-input"
        placeholder="Search products..."
        defaultValue={currentQ}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 w-48 lg:w-64"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
