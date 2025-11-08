'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShoppingCart, Package, User } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  readonly name: string;
  readonly href: string;
  readonly icon: typeof ShoppingBag;
}

const navItems: readonly NavItem[] = [
  {
    name: 'Продукты',
    href: '/products',
    icon: ShoppingBag,
  },
  {
    name: 'Корзина',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    name: 'Заказы',
    href: '/orders',
    icon: Package,
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: User,
  },
] as const;

const Header: FC = () => {
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Market
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isCart = item.href === '/cart';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors relative ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {isCart && cartItemsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

