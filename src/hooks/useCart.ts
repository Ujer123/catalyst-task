import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { addToCart, updateQuantity, removeFromCart } from '@/slices/cartSlice';

export const useCart = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch<AppDispatch>();
  return {
    cart,
    addToCart: (item: { id: number; title: string; price: number }) => dispatch(addToCart(item)),
    updateQuantity: (id: number, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    removeFromCart: (id: number) => dispatch(removeFromCart(id)),
  };
};
