import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import ProductDetailActions from '@/components/ProductDetailActions';

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

  const response = await fetch(`http://localhost:3000/api/products?productId=${id}`, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  });

  if (!response.ok) {
    redirect('/');
  }

  const data = await response.json();
  const product = data.product;

  if (!product) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
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

          {product.images && product.images.length > 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-700">
                    <Image
                      src={img}
                      alt={`${product.title} image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
