import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CartContent from '@/components/CartContent';

export default async function CartPage() {
    const cookieStore = await cookies();
  const token = cookieStore.get('dummy_token')?.value;
  if (!token) redirect('/login');

  return (
    <div className="container mx-auto">
      
      <CartContent />
    </div>
  );
}
