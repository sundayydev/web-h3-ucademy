'use client';

import { Providers } from '@/lib/Providers';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <Sidebar />
      {children}
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Providers>
  );
}