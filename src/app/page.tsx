import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
import SearchInput from '@/components/SearchInput';
import { API_URL, APP_URL } from '@/lib/config';

interface Props {
  searchParams: Promise<{
    category?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    order?: string;
    q?: string;
  }>;
}

function getCookieHeader(cookieList: { name: string; value: string }[]) {
  return cookieList
    .map(c => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');
}

async function fetchProducts(category: string, limit: string, skip: string, sortBy: string, order: string, q: string, cookieHeader: string) {
  const params = new URLSearchParams({
    category,
    limit,
    skip,
    sortBy,
    order,
    q,
  });

  const url = `${APP_URL}/api/products?${params.toString()}`;
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_URL}/products/categories`);
  return response.json();
}

function getPaginationInfo(total: number, skip: string, limit: string) {
  const totalPages = Math.ceil(total / parseInt(limit));
  const currentPage = Math.max(1, Math.floor(parseInt(skip) / parseInt(limit)) + 1);
  return { totalPages, currentPage };
}

export default async function ProductsPage({ searchParams }: Props) {
  
  const params = await searchParams;
  const category = params.category || '';
  const limit = params.limit || '9';
  const skip = params.skip || '0';
  const sortBy = params.sortBy || 'title';
  const order = params.order || 'asc';
  const q = params.q || '';

  const cookieStore = await cookies();
  const cookieList = cookieStore.getAll();
  const cookieHeader = getCookieHeader(cookieList);

  const productsData = await fetchProducts(category, limit, skip, sortBy, order, q, cookieHeader);

  if (!productsData) {
    redirect('/login');
  }

  const categories = await fetchCategories();

  const { totalPages, currentPage } = getPaginationInfo(
    productsData.total,
    productsData.skip,
    productsData.limit
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <CategoryFilter categories={categories} />
        </div>

        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">
                Products ({productsData.total})
              </h2>
              <SearchInput />
            </div>
            <SortDropdown 
              currentSortBy={sortBy} 
              currentOrder={order} 
              category={category}
              limit={productsData.limit}
              skip={productsData.skip}
            />            
          </div>

          <ProductGrid products={productsData.products} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={category}
            limit={productsData.limit}
          />
        </div>
      </div>
    </div>
  );
}
