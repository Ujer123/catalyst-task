import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get('category') || '';
  const limit = searchParams.get('limit') || '9';
  const skip = searchParams.get('skip') || '0';
  const search = searchParams.get('q') || '';
  const categoryList = searchParams.get('categoryList') === 'true';
  const productId = searchParams.get('productId');

  const queryString = new URLSearchParams({
    limit,
    skip,
  }).toString();

  let url = '';

  if (productId) {
    url = `${API_URL}/products/${productId}`;
  } else if (categoryList) {
    url = `${API_URL}/products/category-list`;
  } else if (search) {
    url = `${API_URL}/products/search?q=${encodeURIComponent(search)}&${queryString}`;
  } else if (category) {
    url = `${API_URL}/products/category/${category}?${queryString}`;
  } else {
    url = `${API_URL}/products?${queryString}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return NextResponse.json(data);
}
