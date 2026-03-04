"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "flowbite-react";
import { AddToCartButtonProps } from "@/types";

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={() => {
        setLoading(true);
        addToCart(product);
        setTimeout(() => setLoading(false), 500);
      }}
      disabled={loading}
      className="w-full md:w-auto"
      color="cyan"
      size="lg"
    >
      {loading ? "Added!" : "Add to Cart"}
    </Button>
  );
}
