'use client';
import { Pagination as FlowbitePagination } from "flowbite-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationProps } from '@/types';

export default function Pagination({ currentPage, totalPages, category, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('skip', ((page - 1) * parseInt(limit)).toString());
    if (category) params.set('category', category);
    if (searchParams.get('q')) params.set('q', searchParams.get('q')!);
    
    router.push(`/?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <FlowbitePagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={goToPage} 
      />
    </div>
  );
}