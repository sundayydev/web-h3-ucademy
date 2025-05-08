import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IUser } from '@/types/user';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { User } from 'lucide-react';
import Image from 'next/image';
import router from 'next/router';

interface InstructorExtended extends IUser {
  enrolledStudents?: number;
  coursesCount?: number;
}

const InstructorInfoCard = (instructor: InstructorExtended | null) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {instructor ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              {instructor.profileImage ? (
                <Image
                  src={instructor.profileImage}
                  alt={instructor.fullName}
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
                <h3 className="font-medium">{instructor.fullName}</h3>
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
                <p className="font-medium">{instructor.enrolledStudents}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="text-sm mb-4">TODO Bio</p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/admin/instructors/${instructor.id}`)}
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
  );
};

export default InstructorInfoCard;
