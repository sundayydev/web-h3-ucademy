// Interface cho OrderDetail trong CreateOrderDto
export interface OrderDetail {
  courseId: string;
  price: number;
}

// Interface cho CreateOrderDto
export interface CreateOrderDto {
  userId: string;
  amount: number;
  orderDetails: OrderDetail[];
}

// Interface cho response từ create-payment-url
export interface CreatePaymentResponse {
  paymentUrl?: string;
  orderId: string;
  isFree: boolean;
  message?: string;
}

// Interface cho response từ payment-callback
export interface PaymentCallbackResponse {
  success: boolean;
  message?: string;
  orderId?: string;
}
