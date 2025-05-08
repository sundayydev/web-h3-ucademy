import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Chapter } from '@/types/chapter';
import { Enrollment } from '@/types/enrollment';
import { Lesson } from '@/types/lesson';
import { Review } from '@/types/review';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Clock, Table, Badge } from 'lucide-react';
import router from 'next/router';
import { format } from 'path';
import React from 'react';

interface CourseTabsProps {
  courseId: string;
  courseContents: string[];
  chapters: Chapter[];
  enrollments: Enrollment[];
  lessons: Record<string, Lesson[]>;
  reviews: Review[];
  onReviewStatusChange: (reviewId: string, status: string) => void;
}

export const CourseTabs = ({
  courseId,
  courseContents,
  chapters,
  enrollments,
  lessons,
  review,
  onReviewStatusChange,
}: CourseTabsProps) => {
  return (
    <div>
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
                  {courseContents.sections.map((section: any, idx: number) => (
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
                  ))}
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
                        {format(new Date(enrollment.enrollDate), 'MMM d, yyyy')}
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
                Showing {enrollments.length} of {course.enrollments} enrollments
              </div>
              <Button variant="outline" size="sm">
                View All Enrollments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseTabs;
