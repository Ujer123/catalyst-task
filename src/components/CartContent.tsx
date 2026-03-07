'use client';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';

export default function CartContent() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started</p>
        <Link 
          href="/" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-7xl px-4 2xl:px-0">
        <div className="gap-4 mb-8 flex">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl flex-1">
            Shopping Cart ({cart.length} items)
          </h2>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
            ← Back to Products
          </Link>
        </div>

        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="w-full lg:max-w-2xl xl:max-w-4xl mb-8 lg:mb-0">
            <div className="space-y-6">
              {cart.map((item) => (
                <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <div className="shrink-0 md:order-1">
                      {item.images?.[0] ? (
                        <Image 
                          width={80} height={80} 
                          className="h-20 w-20 object-cover rounded-lg dark:hidden" 
                          src={item.images[0]} alt={item.title} 
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-10 w-10 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-all dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="w-12 text-center font-semibold text-lg dark:text-white">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-all dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white md:w-32 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
                      <h4 className="block text-lg font-semibold text-gray-900 hover:underline dark:text-white">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500 transition-colors dark:text-red-400"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-6 lg:w-96">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-black dark:text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                  <span className="font-semibold text-black dark:text-white">${(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${(total * 1.18).toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full block text-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                <Link href="/" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
