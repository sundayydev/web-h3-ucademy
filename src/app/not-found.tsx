import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 md:pl-4">
      <div className="text-center animate-bounce">
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200">
          404
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mt-4">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
