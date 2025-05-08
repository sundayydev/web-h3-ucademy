import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types/course';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@radix-ui/react-alert-dialog';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { CheckCircle, XCircle, Edit, Trash } from 'lucide-react';
import React from 'react';

interface AdminActionsCardProps {
  course: Course;
  onDelete: () => void;
}

const AdminActionsCard = ({ course, onDelete }: AdminActionsCardProps) => {
  return (
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
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                course "{course.title}" and remove all associated data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AdminActionsCard;
