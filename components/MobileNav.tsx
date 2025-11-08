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

const MobileNav: FC = () => {
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCart = item.href === '/cart';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {isCart && cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold shadow-md"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

