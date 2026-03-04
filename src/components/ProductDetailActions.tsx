'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from 'flowbite-react';
import { Product } from '@/types';

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  const handleIncrease = () => {
    if (isInCart) {
      updateQuantity(product.id, quantity + 1);
    } else {
      addToCart({ id: product.id, title: product.title, price: product.price });
    }
  };

  const handleDecrease = () => {
    if (isInCart) {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  }
  };

  if (isInCart) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDecrease}
            color="cyan"
            size="lg"
            className="w-12 h-12 p-0 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
          <Button
            onClick={handleIncrease}
            color="cyan"
            size="lg"
            className="w-12 h-12 p-0 flex items-center justify-center"
            
            aria-label="Increase quantity"
          >
            +
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleIncrease}
      color="cyan"
      size="lg"
      className="w-full md:w-auto"
    >
      Add to Cart
    </Button>
  );
}
