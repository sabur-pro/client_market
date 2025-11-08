'use client';

import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import MobileNav from './MobileNav';

const authPages = ['/welcome', '/login', '/register'];

interface ConditionalNavProps {
  children: ReactNode;
}

const ConditionalNav: FC<ConditionalNavProps> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = authPages.some(page => pathname.startsWith(page));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </>
  );
};

export default ConditionalNav;

