import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should navigate with search query when search button is clicked', () => {
  render(<SearchInput />);
  
  const input = screen.getByPlaceholderText('Search products...');
  const button = screen.getByRole('button', { name: /search/i });

  fireEvent.change(input, { target: { value: 'phone' } });
  fireEvent.click(button);

  expect(mockPush).toHaveBeenCalledWith('/?q=phone&skip=0');
});
