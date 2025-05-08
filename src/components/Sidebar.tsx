'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaEnvelope, FaNewspaper, FaInfoCircle } from 'react-icons/fa';

const sidebarItems = [
  {
    section: 'Chung',
    items: [
      { path: '/', icon: <FaHome size={16} />, text: 'Trang chủ' },
      { path: '/contact', icon: <FaEnvelope size={16} />, text: 'Liên hệ' },
    ],
  },
  {
    section: 'Nội dung',
    items: [
      { path: '/post', icon: <FaNewspaper size={16} />, text: 'Bài viết' },
      { path: '/about', icon: <FaInfoCircle size={16} />, text: 'Giới thiệu' },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  // Không render Sidebar trên trang /login hoặc /register
  if (['/login', '/register'].includes(pathname)) {
    return null;
  }

  return (
    <aside className="bg-white md:p-4 flex flex-col md:w-64 md:min-h-screen md:relative fixed bottom-0 w-full border-t md:border-0 z-10">
      <nav className="mt-1 flex md:flex-col justify-center md:justify-start">
        {sidebarItems.map((group, index) => (
          <div key={index} className="flex md:block">
            <div className="text-gray-400 uppercase text-xs font-semibold hidden ml-3 md:block">
              {group.section}
            </div>
            {group.items.map((item, idx) => (
              <SidebarItem key={idx} {...item} />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
}

const SidebarItem = ({ icon, text, path }: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log('Current pathname:', pathname); // Debug (dòng 53)

  const isActive = pathname === path;

  return (
    <a
      onClick={() => router.push(path)}
      className={`flex items-center flex-col md:flex-row md:w-auto md:mb-2 p-2 m-2 md:rounded-lg 
        ${isActive ? 'text-black font-semibold md:font-normal md:bg-gray-100 md:text-gray-900' : 'text-gray-600'} 
        md:hover:bg-gray-100`}
    >
      <span
        className={`text-lg ${isActive ? 'text-pink-500 md:text-gray-900' : 'text-gray-600'}`}
      >
        {icon}
      </span>
      <span
        className={`md:ml-2 text-xs md:text-base ${isActive ? 'font-bold md:font-normal' : ''}`}
      >
        {text}
      </span>
    </a>
  );
};

export default Sidebar;