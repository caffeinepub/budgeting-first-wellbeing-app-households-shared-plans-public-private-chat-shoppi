import { useGetAllUsersAsStaff } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import UserAvatar from '../../components/profile/UserAvatar';
import type { DateOfBirth } from '../../backend';

function calculateAge(dob: DateOfBirth): number {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  
  let age = currentYear - Number(dob.year);
  
  if (currentMonth < Number(dob.month) || (currentMonth === Number(dob.month) && currentDay < Number(dob.day))) {
    age--;
  }
  
  return age;
}

export default function StaffDirectory() {
  const { data: users, isLoading } = useGetAllUsersAsStaff();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Staff Directory
        </h1>
        <p className="text-muted-foreground">View all user profiles including private information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete user directory with private details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map(([username, publicProfile, privateProfile]) => (
                <TableRow key={username}>
                  <TableCell>
                    <UserAvatar username={username} avatar={publicProfile.avatar} size="sm" />
                  </TableCell>
                  <TableCell className="font-medium">{username}</TableCell>
                  <TableCell>{privateProfile?.fullName || 'N/A'}</TableCell>
                  <TableCell>
                    {privateProfile ? calculateAge(privateProfile.dob) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {privateProfile?.isAdult ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        18+
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Under 18</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
