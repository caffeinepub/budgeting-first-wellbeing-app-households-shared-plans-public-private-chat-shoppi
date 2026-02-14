import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AvatarUploader from './AvatarUploader';
import UserAvatar from './UserAvatar';
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

export default function ProfileSettings() {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [fullName, setFullName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    if (userProfile?.privateDetails) {
      setFullName(userProfile.privateDetails.fullName);
      setYear(userProfile.privateDetails.dob.year.toString());
      setMonth(userProfile.privateDetails.dob.month.toString());
      setDay(userProfile.privateDetails.dob.day.toString());
    }
  }, [userProfile]);

  const handleSave = async () => {
    setAgeError('');

    if (!fullName.trim() || !year || !month || !day) {
      toast.error('Please fill in all fields');
      return;
    }

    const dob: DateOfBirth = {
      year: BigInt(year),
      month: BigInt(month),
      day: BigInt(day),
    };

    const age = calculateAge(dob);

    if (age < 18) {
      setAgeError('Access restricted: You must be 18 years or older to use this application.');
      return;
    }

    try {
      await saveProfile.mutateAsync({ fullName: fullName.trim(), dob });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture to personalize your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar 
              username={userProfile?.publicProfile.username} 
              avatar={userProfile?.publicProfile.avatar}
              size="lg"
            />
            <AvatarUploader />
          </div>
        </CardContent>
      </Card>

      {/* Public Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>Information visible to other users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={userProfile?.publicProfile.username || ''} disabled />
            <p className="text-xs text-muted-foreground">Your username cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      {/* Private Information */}
      <Card>
        <CardHeader>
          <CardTitle>Private Information</CardTitle>
          <CardDescription>Only visible to you and staff members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ageError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{ageError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Day"
                min="1"
                max="31"
              />
              <Input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Month"
                min="1"
                max="12"
              />
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
