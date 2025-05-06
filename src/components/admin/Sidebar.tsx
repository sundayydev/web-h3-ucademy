'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  GraduationCap,
  BookOpenText,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
  DollarSign,
  BookOpen,
} from 'lucide-react';

import LogoH3 from '@/public/images/logo-h3.png';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Danh sách sidebar items
const sidebarItems = [
  {
    section: 'Tổng quan',
    items: [
      {
        icon: <LayoutDashboard size={16} />,
        text: 'Dashboard',
        path: '/admin/dashboard',
      },
      {
        icon: <DollarSign size={16} />,
        text: 'Quản lý thanh toán',
        path: '/admin/payments',
      },
      {
        icon: <Users size={16} />,
        text: 'Quản lý học viên',
        path: '/admin/students',
      },
    ],
  },
  {
    section: 'Quản lý khóa học & bài viết',
    items: [
      {
        icon: <GraduationCap size={16} />,
        text: 'Khóa học',
        path: '/admin/courses',
      },
      {
        icon: <BookOpenText size={16} />,
        text: 'Bài viết',
        path: '/admin/post-management',
      },
      {
        icon: <CreditCard size={16} />,
        text: 'Quản lý khóa học',
        path: '/admin/course-management',
        badge: 'NEW',
        badgeType: 'beta',
      },
      {
        icon: <BookOpen size={16} />,
        text: 'Bình luận bài viết',
        path: '/admin/comment',
      },
    ],
  },
  {
    section: 'Cài đặt & Hỗ trợ',
    items: [
      {
        icon: <Settings size={16} />,
        text: 'Cài đặt hệ thống',
        path: '/admin/settings',
      },
      { icon: <Shield size={16} />, text: 'Bảo mật', path: '/admin/security' },
      { icon: <HelpCircle size={16} />, text: 'Trợ giúp', path: '/admin/help' },
    ],
  },
];

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  badge?: string | null;
  badgeType?: string | null;
  active: boolean;
  path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  badge = null,
  badgeType = null,
  active,
  path,
}) => {
  return (
    <Link href={path || '#'} className="block">
      <div
        className={`flex items-center p-2.5 rounded-lg transition-colors ${
          active
            ? 'bg-pink-50 text-pink-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
        }`}
      >
        {icon}
        <span className="ml-3 font-medium md:block hidden">{text}</span>
        {badge && (
          <span
            className={`ml-auto px-2 py-0.5 text-xs rounded-full font-semibold ${
              badgeType === 'beta'
                ? 'bg-pink-100 text-pink-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};
interface AdminSidebarProps {
  className?: string;
}
export const AdminSidebar: React.FC<AdminSidebarProps> = () => {
  const pathname = usePathname();

  // Desktop sidebar
  const DesktopSidebar = () => (
    <aside className="hidden md:flex w-64 h-screen bg-white shadow-md p-4 flex-col">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <Link href="/admin" className="rounded-lg">
          <div className="w-10 h-10 relative">
            <Image
              src={LogoH3}
              alt="Logo H3"
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </Link>
        <Link
          className="font-semibold text-base text-black hover:text-pink-600"
          href="/admin"
        >
          H3 Admin
        </Link>
      </h1>

      {/* Sidebar Items */}
      <nav className="mt-6 flex flex-col space-y-4">
        {sidebarItems.map((group, index) => (
          <div key={index}>
            <div className="text-gray-500 uppercase text-xs font-bold mb-2">
              {group.section}
            </div>
            {group.items.map((item, idx) => {
              const active = !!(item.path && pathname === item.path);
              return <SidebarItem key={idx} {...item} active={active} />;
            })}
            {index < sidebarItems.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <Card className="p-3 flex items-center justify-between bg-white-50 hover:bg-white-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="ring ring-pink-200 ring-offset-2">
              <AvatarImage
                src="https://avatar.iran.liara.run/public"
                alt="Ngô Mạnh Hùng"
              />
              <AvatarFallback>NMH</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold">Ngô Mạnh Hùng</div>
              <div className="text-gray-600 text-sm">Loại tài khoản: Admin</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center text-gray-500 text-xs mt-4">
        © 2024 H3 Udemy
      </div>
    </aside>
  );

  // Mobile fixed sidebar (just icons)
  const MobileFixedSidebar = () => (
    <aside className="md:hidden flex w-16 h-screen bg-white shadow-md p-2 flex-col">
      {/* Logo */}
      <h1 className="flex justify-center my-4">
        <Link href="/admin" className="rounded-lg">
          <div className="w-8 h-8 relative">
            <Image
              src="/LogoH3.png"
              alt="Logo H3"
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </Link>
      </h1>

      {/* Sidebar Items */}
      <nav className="mt-6 flex flex-col space-y-6">
        {sidebarItems.map((group, index) => (
          <div key={index} className="flex flex-col items-center">
            {group.items.map((item, idx) => {
              const active = item.path && pathname === item.path;
              return (
                <Link
                  key={idx}
                  href={item.path || '#'}
                  className="w-full py-1.5"
                >
                  <div
                    className={`flex justify-center p-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
                    }`}
                  >
                    {item.icon}
                  </div>
                </Link>
              );
            })}
            {index < sidebarItems.length - 1 && (
              <Separator className="my-2 w-full" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex justify-center">
        <ChevronDown size={16} className="text-gray-500 mb-4" />
      </div>
    </aside>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileFixedSidebar />
    </>
  );
};
