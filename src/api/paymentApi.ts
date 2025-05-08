import { jwtDecode } from 'jwt-decode';
import { CreateOrderDto, CreatePaymentResponse, PaymentCallbackResponse } from '@/types/payment';
// Định nghĩa API URL từ biến môi trường
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Payment`;

// Hàm lấy token từ localStorage
export const getAuthToken = (): string => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

// Hàm giải mã token JWT
export const getDecodedToken = () => {
  const token = getAuthToken();
  return jwtDecode(token);
};
// Hàm gọi POST /api/Payment/create-payment-url
export const createPayment = async (order: CreateOrderDto): Promise<CreatePaymentResponse> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/create-payment-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || 'Không thể tạo URL thanh toán');
    }

    const data = await response.json();
    console.log('API response (create-payment-url):', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán:', error);
    throw error;
  }
};

// Hàm gọi GET /api/Payment/payment-callback
export const paymentCallback = async (queryParams: Record<string, string>): Promise<PaymentCallbackResponse> => {
  try {
    const token = getAuthToken();
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_URL}/payment-callback?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || 'Không thể xử lý callback thanh toán');
    }

    const data = await response.json();
    console.log('API response (payment-callback):', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi xử lý callback thanh toán:', error);
    throw error;
  }
};