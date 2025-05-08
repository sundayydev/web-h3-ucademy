import React from 'react';

import { AdminSidebar } from '@/components/admin/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Người tạo nội dung',
  description: 'Đây là trang Dashboard của Instructor',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 w-full">
        {/* Sidebar - fixed width */}
        <AdminSidebar className="border-r bg-white shadow-sm" />

        {/* Main content area - takes remaining space */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
