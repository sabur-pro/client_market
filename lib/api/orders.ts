import { apiClient } from './client';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  quantity: number;
  price: number;
  productName?: string | null;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    category: string | null;
    stock: number;
  } | null;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderFilters {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  page?: number;
  limit?: number;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const ordersApi = {
  createOrder: async (): Promise<Order> => {
    const response = await apiClient.post('/orders');
    return response.data;
  },

  getUserOrders: async (filters?: OrderFilters): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/orders?${params.toString()}`);
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
};
