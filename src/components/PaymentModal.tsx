'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { createEnrollment } from '@/api/enrollmentApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  courseId: string;
  price: number;
  onClose: () => void;
}

const PaymentModal = ({ courseId, price, onClose }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Vui lòng đăng nhập để thanh toán');

      // Giả lập gọi API thanh toán
      //await createPayment({ courseId, amount: price });
      // Đăng ký khóa học sau khi thanh toán thành công
      await createEnrollment(courseId);

      toast.success('Thanh toán và đăng ký khóa học thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onClose();
      router.push(`/detailsPageCourse/${courseId}`);
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      toast.error('Lỗi khi thanh toán. Vui lòng thử lại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thanh toán khóa học</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </DialogHeader>
        <div className="py-4">
          <p className="text-lg font-semibold">
            Số tiền: {price.toLocaleString()} VND
          </p>
          <p className="text-gray-600 mt-2">
            Vui lòng xác nhận thanh toán để đăng ký khóa học.
          </p>
          {/* Giả lập phương thức thanh toán */}
          <div className="mt-4">
            <p className="text-sm font-medium">
              Phương thức thanh toán: Thẻ tín dụng (giả lập)
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
