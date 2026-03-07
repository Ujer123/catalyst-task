import { redirect } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
import SearchInput from '@/components/SearchInput';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

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

async function fetchProducts(category: string, limit: string, skip: string, sortBy: string, order: string, q: string) {
  const queryParams: Record<string, string> = { limit, skip, sortBy, order };
  if (q) queryParams.q = q;
  
  const queryString = new URLSearchParams(queryParams).toString();
  
  let url = `${API_URL}/products`;
  if (q) {
    url = `${API_URL}/products/search?${queryString}`;
  } else if (category) {
    url = `${API_URL}/products/category/${category}?${queryString}`;
  } else {
    url = `${API_URL}/products?${queryString}`;
  }
  
  const response = await fetch(url, { cache: 'no-store' });
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_URL}/products/categories`);
  return response.json();
}

function getPaginationInfo(total: number, skip: number | string, limit: number | string) {
  const limitNum = Number(limit) || 9;
  const skipNum = Number(skip) || 0;
  const totalPages = limitNum === 0 ? 1 : Math.ceil(total / limitNum);
  const currentPage = limitNum === 0 ? 1 : Math.max(1, Math.floor(skipNum / limitNum) + 1);
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


  const productsData = await fetchProducts(category, limit, skip, sortBy, order, q);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <CategoryFilter categories={categories} />
            {(category || q) && (
              <Link
                href={`/?limit=${limit}&skip=0&sortBy=${sortBy}&order=${order}`}
                className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-500"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Products 
                <span className="text-gray-500 font-normal">
                  ({productsData.total})
                </span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <SearchInput />
              </div>
              <SortDropdown 
                currentSortBy={sortBy} 
                currentOrder={order} 
                category={category}
                q={q}
              />            
            </div>
          </div>

          <ProductGrid products={productsData.products} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={category}
            limit={productsData.limit}
            q={q}
          />
        </main>
      </div>
    </div>
  );
}
