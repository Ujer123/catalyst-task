import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('dummy_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get('category') || '';
  const limit = searchParams.get('limit') || '9';
  const skip = searchParams.get('skip') || '0';
  const sortBy = searchParams.get('sortBy') || 'title';
  const order = searchParams.get('order') || 'asc';
  const search = searchParams.get('q') || '';
  const categoryList = searchParams.get('categoryList') === 'true';
  const productId = searchParams.get('productId');

  const queryString = new URLSearchParams({
    limit,
    skip,
    sortBy,
    order,
  }).toString();

  let url = '';

  if (productId) {
    // Fetch single product by ID
    url = `https://dummyjson.com/products/${productId}`;
  } else if (categoryList) {
    url = 'https://dummyjson.com/products/category-list';
  } else if (search) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&${queryString}`;
  } else if (category) {
    url = `https://dummyjson.com/products/category/${category}?${queryString}`;
  } else {
    url = `https://dummyjson.com/products?${queryString}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return NextResponse.json(data);
}
