'use client';

import { FC, useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchOrders, fetchMoreOrders, setStatusFilter } from '@/lib/features/orders/ordersSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar, CreditCard } from 'lucide-react';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import OrderCardSkeleton from '@/components/skeletons/OrderCardSkeleton';
import { getImageUrl } from '@/lib/utils';

const OrdersPage: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, loadingMore, error, statusFilter, hasMore } = useAppSelector((state) => state.orders);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, statusFilter]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loadingMore && hasMore && orders.length > 0) {
        dispatch(fetchMoreOrders());
      }
    },
    [loadingMore, hasMore, orders.length, dispatch]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  const handleStatusFilterChange = (value: string) => {
    if (value === 'all') {
      dispatch(setStatusFilter(null));
    } else {
      dispatch(setStatusFilter(value as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Ожидает
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-blue-500">
            <Package className="h-3 w-3" />
            В обработке
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" />
            Выполнен
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Отменён
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает подтверждения';
      case 'PROCESSING':
        return 'В обработке';
      case 'COMPLETED':
        return 'Выполнен';
      case 'CANCELLED':
        return 'Отменён';
      default:
        return status;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Мои заказы</h1>
          <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Все заказы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="PENDING">Ожидает</SelectItem>
              <SelectItem value="PROCESSING">В обработке</SelectItem>
              <SelectItem value="COMPLETED">Выполнен</SelectItem>
              <SelectItem value="CANCELLED">Отменён</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Мои заказы</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500 text-sm md:text-base">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Мои заказы</h1>
          <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Все заказы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="PENDING">Ожидает</SelectItem>
              <SelectItem value="PROCESSING">В обработке</SelectItem>
              <SelectItem value="COMPLETED">Выполнен</SelectItem>
              <SelectItem value="CANCELLED">Отменён</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 text-sm md:text-base">
              {statusFilter ? `Нет заказов со статусом "${getStatusText(statusFilter)}"` : 'У вас пока нет заказов'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Мои заказы</h1>
        
        <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Все заказы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заказы</SelectItem>
            <SelectItem value="PENDING">Ожидает</SelectItem>
            <SelectItem value="PROCESSING">В обработке</SelectItem>
            <SelectItem value="COMPLETED">Выполнен</SelectItem>
            <SelectItem value="CANCELLED">Отменён</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 animate-fade-in">
        {orders.map((order) => {
          const isExpanded = expandedOrders.has(order.id);
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
          
          return (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 md:p-5 cursor-pointer" onClick={() => toggleOrder(order.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                      <CardTitle className="text-sm md:text-base">
                        Заказ #{order.id.slice(0, 8)}
                      </CardTitle>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span>{totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(order.status)}
                      <div className="flex items-center gap-1 text-lg md:text-xl font-bold">
                        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                        {order.totalAmount.toFixed(2)} сом.
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrder(order.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-4 pt-0 md:p-5 md:pt-0 border-t animate-in slide-in-from-top-2">
                  <div className="space-y-3 md:space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3 md:gap-4 p-2 md:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        {item.product ? (
                          <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 bg-white rounded-md overflow-hidden shadow-sm">
                            <ImageWithSkeleton
                              src={getImageUrl(item.product.imageUrl)}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 64px, 80px"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">
                            {item.product ? item.product.name : (item.productName || 'Товар удалён')}
                          </h4>
                          {!item.product && (
                            <p className="text-xs text-red-500 mb-1">Товар больше не доступен</p>
                          )}
                          <div className="flex flex-col gap-1 text-xs md:text-sm">
                            <p className="text-gray-600">
                              Цена: <span className="font-medium text-gray-900">{item.price.toFixed(2)} сом.</span>
                            </p>
                            <p className="text-gray-600">
                              Количество: <span className="font-medium text-gray-900">{item.quantity} шт.</span>
                            </p>
                            <p className="text-gray-900 font-bold mt-1">
                              Итого: {(item.price * item.quantity).toFixed(2)} сом.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
        
        <div ref={observerTarget} className="w-full py-4">
          {loadingMore && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        {!hasMore && orders.length > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Все заказы загружены
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

