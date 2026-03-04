"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "flowbite-react";

interface Props {
  currentSortBy: string;
  currentOrder: string;
  category?: string;
  limit: string;
  skip: string;
}

export default function SortDropdown({ currentSortBy, currentOrder, category}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, order] = e.target.value.split("-");
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", sortBy);
    params.set("order", order);
    params.set("skip", "0"); 
    if (category) params.set("category", category);
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(`/?${params.toString()}`);
  };

  const currentValue = `${currentSortBy}-${currentOrder}`;

  return (
    <Select 
      id="sort" 
      value={currentValue} 
      onChange={handleSortChange}
      className="w-48"
    >
      <option value="title-asc">Name (A-Z)</option>
      <option value="title-desc">Name (Z-A)</option>
      <option value="price-asc">Price (Low to High)</option>
      <option value="price-desc">Price (High to Low)</option>
    </Select>
  );
}
