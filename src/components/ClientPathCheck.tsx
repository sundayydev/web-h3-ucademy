'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type ClientPathCheckProps = {
  children: ReactNode;
  excludePaths: string[];
};

export function ClientPathCheck({
  children,
  excludePaths,
}: ClientPathCheckProps) {
  const pathname = usePathname();

  // Check if current path starts with any of the excluded paths
  const shouldHide = excludePaths.some((path) => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <>{children}</>;
}
