import { apiClient } from './client';
import { Product } from './products';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartDto): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/items', data);
    return response.data;
  },

  updateCartItem: async (itemId: string, data: UpdateCartItemDto): Promise<Cart> => {
    const response = await apiClient.patch<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete<Cart>('/cart');
    return response.data;
  },
};

