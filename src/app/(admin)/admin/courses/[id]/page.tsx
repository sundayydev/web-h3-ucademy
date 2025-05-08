// app/admin/courses/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Flag,
  Star,
  Trash,
  User,
  XCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CourseStatusBadge } from '@/components/admin/courses/CourseStatusBadge';
import ConfirmDeleteDialog from '@/components/admin/courses/ConfirmDeleteDialog';
import CourseStats from '@/components/admin/courses/CourseStats';
import CourseBasicInfo from '@/components/admin/courses/CourseBasicInfo';

// Course interface as provided
interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  urlImage?: string;
  instructorId: string;
  categoryId?: string | null;
  createdAt: string;
  contents: string | null;
  status?: 'published' | 'draft' | 'reviewing' | 'rejected';
  enrollments?: number;
  rating?: number;
  revenue?: number;
}

// Sample instructor data
interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  email: string;
  enrolledStudents?: number;
  coursesCount?: number;
}

// Sample category data
interface Category {
  id: string;
  name: string;
}

// Sample student enrollment data
interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  enrollDate: string;
  completionPercentage: number;
  status: 'active' | 'completed' | 'dropped';
}

// Sample review data
interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
}

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch the course data from your API
    const fetchCourseData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock course data
        const mockCourse: Course = {
          id: courseId,
          title: 'Mastering Web Development with Next.js and TypeScript',
          description:
            'A comprehensive course on building modern web applications using Next.js, TypeScript, and various UI libraries including Tailwind CSS and shadcn/ui.',
          price: 99.99,
          urlImage: '/api/placeholder/800/450',
          instructorId: 'inst-123',
          categoryId: 'cat-web-dev',
          createdAt: new Date().toISOString(),
          contents: JSON.stringify({
            sections: [
              {
                title: 'Introduction to Next.js',
                lessons: [
                  'Next.js Fundamentals',
                  'Setting Up Your Environment',
                  'Project Structure',
                ],
              },
              {
                title: 'TypeScript Integration',
                lessons: [
                  'TypeScript Basics',
                  'Type Safety in React',
                  'Advanced Types',
                ],
              },
              {
                title: 'Styling with Tailwind CSS',
                lessons: [
                  'Tailwind Basics',
                  'Responsive Design',
                  'Custom Configurations',
                ],
              },
            ],
          }),
          status: 'published',
          enrollments: 237,
          rating: 4.7,
          revenue: 21589.95,
        };

        // Mock instructor data
        const mockInstructor: Instructor = {
          id: 'inst-123',
          name: 'Alex Johnson',
          bio: 'Senior Web Developer with 10+ years of experience in building modern web applications.',
          avatarUrl: '/api/placeholder/150/150',
          email: 'alex.johnson@example.com',
          enrolledStudents: 1543,
          coursesCount: 8,
        };

        // Mock category data
        const mockCategory: Category = {
          id: 'cat-web-dev',
          name: 'Web Development',
        };

        // Mock enrollments data
        const mockEnrollments: Enrollment[] = [
          {
            id: 'enr-001',
            studentName: 'John Doe',
            studentEmail: 'john.doe@example.com',
            enrollDate: new Date(2024, 3, 15).toISOString(),
            completionPercentage: 78,
            status: 'active',
          },
          {
            id: 'enr-002',
            studentName: 'Jane Smith',
            studentEmail: 'jane.smith@example.com',
            enrollDate: new Date(2024, 2, 20).toISOString(),
            completionPercentage: 100,
            status: 'completed',
          },
          {
            id: 'enr-003',
            studentName: 'Michael Brown',
            studentEmail: 'michael.brown@example.com',
            enrollDate: new Date(2024, 4, 2).toISOString(),
            completionPercentage: 35,
            status: 'active',
          },
          {
            id: 'enr-004',
            studentName: 'Emily Wilson',
            studentEmail: 'emily.wilson@example.com',
            enrollDate: new Date(2024, 3, 28).toISOString(),
            completionPercentage: 12,
            status: 'dropped',
          },
          {
            id: 'enr-005',
            studentName: 'Robert Taylor',
            studentEmail: 'robert.taylor@example.com',
            enrollDate: new Date(2024, 4, 5).toISOString(),
            completionPercentage: 45,
            status: 'active',
          },
        ];

        // Mock reviews data
        const mockReviews: Review[] = [
          {
            id: 'rev-001',
            studentName: 'John Doe',
            rating: 5,
            comment:
              'Excellent course! The content is well-structured and the instructor explains complex concepts in an easy-to-understand manner.',
            date: new Date(2024, 3, 25).toISOString(),
            status: 'approved',
          },
          {
            id: 'rev-002',
            studentName: 'Jane Smith',
            rating: 5,
            comment:
              "One of the best courses I've taken. Highly recommended for anyone wanting to learn Next.js and TypeScript.",
            date: new Date(2024, 3, 10).toISOString(),
            status: 'approved',
          },
          {
            id: 'rev-003',
            studentName: 'Michael Brown',
            rating: 4,
            comment:
              'Great course overall, but some sections could use more practical examples.',
            date: new Date(2024, 4, 5).toISOString(),
            status: 'pending',
          },
          {
            id: 'rev-004',
            studentName: 'Emily Wilson',
            rating: 2,
            comment:
              "The course content seems outdated. Many of the examples don't work with the latest versions.",
            date: new Date(2024, 4, 2).toISOString(),
            status: 'flagged',
          },
        ];

        setCourse(mockCourse);
        setInstructor(mockInstructor);
        setCategory(mockCategory);
        setEnrollments(mockEnrollments);
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleStatusChange = (newStatus: string) => {
    if (course) {
      setCourse({
        ...course,
        status: newStatus as Course['status'],
      });
      // In a real app, you would send this update to your API
      console.log(`Course status updated to: ${newStatus}`);
    }
  };

  const handleReviewStatusChange = (
    reviewId: string,
    newStatus: Review['status']
  ) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
    // In a real app, you would send this update to your API
    console.log(`Review ${reviewId} status updated to: ${newStatus}`);
  };

  const handleDeleteCourse = () => {
    // In a real app, you would send a delete request to your API
    console.log(`Course ${courseId} deleted`);
    router.push('/admin/courses');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => router.push('/admin/courses')}
        >
          Return to Course List
        </Button>
      </div>
    );
  }

  // Parse course contents if available
  const courseContents = course.contents ? JSON.parse(course.contents) : null;

  // Calculate total lessons
  const totalLessons =
    courseContents && courseContents.sections
      ? courseContents.sections.reduce(
          (total: number, section: any) => total + section.lessons.length,
          0
        )
      : 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Admin Actions Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Chi tiết khóa học
            <CourseStatusBadge status={course.status} />
          </h1>
          <p className="text-muted-foreground mt-1">
            Mã khóa học{' '}
            <span className="font-semibold text-pink-500">
              #{courseId}
            </span>{' '}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            defaultValue={course.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="reviewing">Đang xem xét</SelectItem>
              <SelectItem value="rejected">Loại bỏ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <ConfirmDeleteDialog
            title={course.title}
            onConfirm={handleDeleteCourse}
          />
        </div>
      </div>

      {/* Course Stats */}
      <CourseStats reviewCount={0} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Basic Info */}
          <CourseBasicInfo
            course={course}
            category={undefined}
            courseId={courseId}
          />

          {/* Content Tabs */}
          <Tabs defaultValue="curriculum">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      Manage course content and structure
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/courses/${courseId}/curriculum/edit`)
                    }
                  >
                    Edit Curriculum
                  </Button>
                </CardHeader>
                <CardContent>
                  {courseContents && courseContents.sections ? (
                    <div className="space-y-6">
                      {courseContents.sections.map(
                        (section: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                            <h3 className="text-lg font-medium flex items-center">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 text-sm mr-2">
                                {idx + 1}
                              </span>
                              {section.title}
                            </h3>
                            <ul className="space-y-2 pl-8">
                              {section.lessons.map(
                                (lesson: string, lessonIdx: number) => (
                                  <li
                                    key={lessonIdx}
                                    className="flex items-center gap-2 p-2 rounded bg-muted/50"
                                  >
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{lesson}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No curriculum content has been added yet.
                      </p>
                      <Button
                        onClick={() =>
                          router.push(
                            `/admin/courses/${courseId}/curriculum/create`
                          )
                        }
                      >
                        Create Curriculum
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollments</CardTitle>
                  <CardDescription>
                    Students enrolled in this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {enrollment.studentName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {enrollment.studentEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(enrollment.enrollDate),
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${
                                  enrollment.completionPercentage >= 80
                                    ? 'bg-green-500'
                                    : enrollment.completionPercentage >= 40
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                }`}
                                style={{
                                  width: `${enrollment.completionPercentage}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 text-right">
                              {enrollment.completionPercentage}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.status === 'active'
                                  ? 'default'
                                  : enrollment.status === 'completed'
                                    ? 'outline'
                                    : 'destructive'
                              }
                            >
                              {enrollment.status.charAt(0).toUpperCase() +
                                enrollment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/students/${enrollment.id}`)
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {enrollments.length} of {course.enrollments}{' '}
                    enrollments
                  </div>
                  <Button variant="outline" size="sm">
                    View All Enrollments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Reviews</CardTitle>
                  <CardDescription>
                    Manage student reviews and ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {review.studentName}
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                review.status === 'approved'
                                  ? 'default'
                                  : review.status === 'pending'
                                    ? 'outline'
                                    : 'destructive'
                              }
                            >
                              {review.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(review.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <div className="flex justify-end gap-2 mt-4">
                          {review.status !== 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() =>
                                handleReviewStatusChange(review.id, 'approved')
                              }
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          )}
                          {review.status !== 'flagged' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600"
                              onClick={() =>
                                handleReviewStatusChange(review.id, 'flagged')
                              }
                            >
                              <Flag className="mr-1 h-4 w-4" />
                              Flag
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Revenue Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Revenue Over Time
                      </h3>
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Revenue chart placeholder
                        </p>
                      </div>
                    </div>

                    {/* Enrollment Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Enrollments Over Time
                      </h3>
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Enrollments chart placeholder
                        </p>
                      </div>
                    </div>

                    {/* Demographics */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Student Demographics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location Chart Placeholder */}
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Geographic distribution
                          </p>
                        </div>

                        {/* Age Distribution Placeholder */}
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Age distribution
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructor ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {instructor.avatarUrl ? (
                        <Image
                          src={instructor.avatarUrl}
                          alt={instructor.name}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <User size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{instructor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {instructor.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Courses</p>
                        <p className="font-medium">{instructor.coursesCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Students</p>
                        <p className="font-medium">
                          {instructor.enrolledStudents}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <p className="text-sm mb-4">{instructor.bio}</p>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(`/admin/instructors/${instructor.id}`)
                      }
                    >
                      View Full Profile
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Instructor information not available.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Course Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Visibility
                  </label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="password">
                        Password Protected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Featured Status
                  </label>
                  <Select defaultValue="not-featured">
                    <SelectTrigger>
                      <SelectValue placeholder="Select featured status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Comments
                  </label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue placeholder="Comment settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="moderated">Moderated</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>

            {/* Approval Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Request Changes
                </Button>

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Course
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the course "{course.title}" and remove all
                        associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteCourse}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
