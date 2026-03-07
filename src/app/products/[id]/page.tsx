import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProductDetailActions from '@/components/ProductDetailActions';
import ProductImageGallery from '@/components/ProductImageGallery';

interface Props {
  params: Promise<{ id: string }>;
}

function getCookieHeader(cookieList: { name: string; value: string }[]) {
  return cookieList
    .map(c => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('dummy_token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const cookieList = cookieStore.getAll();
  const cookieHeader = getCookieHeader(cookieList);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products?productId=${id}`, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  });

  if (!response.ok) {
    redirect('/');
  }

  const data = await response.json();
  const product = data.product ?? data;

  if (!product?.id) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductImageGallery 
          images={product.images}
          title={product.title}
        />
        
        <div className="flex flex-col justify-center">
          <span className="text-sm text-gray-500 mb-2">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="text-lg text-gray-500 line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Brand</span>
              <p className="font-semibold">{product.brand}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">SKU</span>
              <p className="font-semibold">{product.sku}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Stock</span>
              <p className="font-semibold">{product.stock} items</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-500">Rating</span>
              <p className="font-semibold">⭐ {product.rating}</p>
            </div>
          </div>

          <ProductDetailActions product={product} />

        </div>
      </div>
    </div>
  );
}
