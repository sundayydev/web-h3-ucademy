'use client';

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Ensure this path is correct or update it to the actual location of the Textarea component.
import {
  getReviewsByCourseId,
  createReview,
  updateReview,
} from '@/api/reviewApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface Review {
  id: string;
  courseId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const Review = ({ courseId }: { courseId: string }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByCourseId(courseId);
        if (response && Array.isArray(response)) {
          setReviews(response);
          const authToken = localStorage.getItem('authToken');
          if (authToken) {
            const decodedToken: { id: string } = jwtDecode(authToken);
            const userReview = response.find(
              (review) => review.userId === decodedToken.id
            );
            if (userReview) {
              setExistingReview(userReview);
              setRating(userReview.rating);
              setReviewText(userReview.comment);
            }
          }
        } else {
          console.error('Invalid reviews data format');
          setReviews([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đánh giá:', error);
        setReviews([]);
      }
    };

    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText) {
      toast.error('Bạn cần chọn sao và nhập bình luận!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Token không hợp lệ hoặc thiếu cấu trúc', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewData = {
        courseId,
        rating,
        comment: reviewText,
      };

      let response: Review;
      if (existingReview) {
        response = await updateReview(existingReview.id, reviewData);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === existingReview.id ? response : review
          )
        );
        toast.success('Đánh giá đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        response = await createReview(reviewData);
        setReviews((prevReviews) => [...prevReviews, response]);
        setExistingReview(response);
        toast.success('Đánh giá đã được gửi thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      toast.error('Lỗi khi gửi đánh giá.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Đánh giá khóa học</h3>

      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={`cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>

      <Textarea
        value={reviewText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setReviewText(e.target.value)
        }
        placeholder="Viết đánh giá của bạn..."
        className="w-full mb-4"
        rows={4}
      />

      <Button
        onClick={handleSubmitReview}
        className={`flex items-center ${existingReview ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Đang gửi...'
          : existingReview
            ? 'Cập nhật đánh giá'
            : 'Gửi đánh giá'}
        <Send className="ml-2" size={18} />
      </Button>

      {reviews.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-4">
            Đánh giá của người khác:
          </h4>
          <div className="space-y-4">
            {reviews.map((review: Review, idx: number) => (
              <div key={idx} className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={16}
                      className={
                        review.rating >= star
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
