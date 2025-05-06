'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@radix-ui/react-select';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Search,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Course } from '@/types/course';
import { getCoursePaginated, getCourses } from '@/api/courseApi';
import { getInstructorById } from '@/api/instructorApi';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [freeCourses, setFreeCourses] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch instructor data when courses change
  useEffect(() => {
    const fetchInstructorData = async () => {
      const instructorMap: {[key: string]: string} = {};
      
      for (const course of courses) {
        if (course.instructorId && !instructorMap[course.instructorId]) {
          try {
            const instructor = await getInstructorById(course.instructorId);
            instructorMap[course.instructorId] = instructor?.Name || 'Chưa có';
          } catch (error) {
            console.error('Error fetching instructor:', error);
            instructorMap[course.instructorId] = 'Chưa có';
          }
        }
      }
      
      setInstructors(instructorMap);
    };

    if (courses.length > 0) {
      fetchInstructorData();
    }
  }, [courses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursePaginated(pageNumber, pageSize);
        setCourses(data.data);
        setTotalPages(Math.ceil(data.total / pageSize));
        

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const data = await getCourses();

        const freeCoursesCount = data.filter((course: Course) => course.price === 0).length;
        setFreeCourses(freeCoursesCount);
        setTotalCourses(data.length);
        
      } catch (error) {
        console.error('Error fetching all courses:', error);
      }
    };

    fetchAllCourses();
  }, []);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card className="bg-white hover:bg-gray-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Tổng số khóa học
            </CardTitle>
            <BookOpen className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {totalCourses}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Khóa học đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white hover:bg-gray-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Khóa học miễn phí
            </CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {freeCourses}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Khóa học không tính phí
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên người dùng hoặc khóa học"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Pending">Đang chờ</SelectItem>
                <SelectItem value="Paid">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Thất bại</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bảng khóa học */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%] text-pink-500">
                  Thông tin khóa học
                </TableHead>
                <TableHead className="w-[15%] text-pink-500">
                  Người dùng tạo
                </TableHead>
                <TableHead className="w-[15%] text-pink-500">
                  Danh mục
                </TableHead>
                <TableHead className="w-[10%] text-pink-500">Giá</TableHead>
                <TableHead className="w-[15%] text-pink-500">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[15%] text-pink-500">
                  Ngày tạo
                </TableHead>
                <TableHead className="w-[15%] text-pink-500">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course: Course) => (
                <TableRow key={course.id}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={
                        course.urlImage
                          ? course.urlImage
                          : process.env.NEXT_PUBLIC_API_URL +
                            '/uploads/default-course.png'
                      }
                      alt={course.title}
                      className="rounded-lg object-cover border"
                      width={50}
                      height={50}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {course.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[200px]"
                    title={course.instructorId}
                  >
                    {instructors[course.instructorId] || 'Đang tải...'}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[150px]"
                    title={course.categoryId || 'Chưa có'}
                  >
                    {course.categoryId || 'Chưa có'}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    {course.price === 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Miễn phí
                      </Badge>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {formatCurrency(course.price)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    Đang duyệt
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">
                    {formatDate(course.createdAt)}
                  </TableCell>
                  <TableCell className="truncate">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trang trước
            </Button>
            <span>
              Trang {pageNumber} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={pageNumber === totalPages}
            >
              Trang sau
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;