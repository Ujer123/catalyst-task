'use client';
import { useCart } from '@/hooks/useCart';
import { Card } from "flowbite-react";
import Link from 'next/link';
import { ProductGridProps } from '@/types';

export default function ProductGrid({ products }: ProductGridProps) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const getCartItem = (productId: number) => {
    return cart.find(item => item.id === productId);
  };

  const handleIncrease = (product: { id: number; title: string; price: number }) => {
    const existingItem = getCartItem(product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      addToCart({ id: product.id, title: product.title, price: product.price });
    }
  };

  const handleDecrease = (productId: number) => {
    const existingItem = getCartItem(productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        updateQuantity(productId, existingItem.quantity - 1);
      } else {
        removeFromCart(productId);
       }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const cartItem = getCartItem(product.id);
        const isInCart = !!cartItem;

        return (
          <Card key={product.id} imgAlt={product.title} imgSrc={product.thumbnail} className="max-w-sm">
            <Link href={`/products/${product.id}`}>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-cyan-700">
                {product.title}
              </h5>
            </Link>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 mt-2.5">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
              
              {isInCart ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(product.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-700 text-white font-bold hover:bg-cyan-800"
                   aria-label={`Decrease quantity of ${product.title}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-black dark:text-white font-semibold">{cartItem?.quantity}</span>
                  <button
                    onClick={() => handleIncrease({ id: product.id, title: product.title, price: product.price })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-700 text-white font-bold hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                   aria-label={`Increase quantity of ${product.title}`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart({ id: product.id, title: product.title, price: product.price })}
                  className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                >
                  Add to cart
                </button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
