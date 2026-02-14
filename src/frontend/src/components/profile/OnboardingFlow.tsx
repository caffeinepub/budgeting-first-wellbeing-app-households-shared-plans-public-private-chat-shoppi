import { useState } from 'react';
import { useCreateProfile } from '../../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
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

export default function OnboardingFlow() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [ageError, setAgeError] = useState('');

  const createProfile = useCreateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError('');

    if (!username.trim() || !fullName.trim() || !year || !month || !day) {
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
      await createProfile.mutateAsync({ username: username.trim(), fullName: fullName.trim(), dob });
      toast.success('Profile created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            We need a few details to get you started. Your real name and date of birth will remain private.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {ageError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{ageError}</AlertDescription>
              </Alert>
            )}

            {createProfile.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(createProfile.error as any)?.message || 'Failed to create profile'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username (Public)</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
              <p className="text-xs text-muted-foreground">This will be visible to other users</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (Private)</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
              <p className="text-xs text-muted-foreground">Only visible to staff</p>
            </div>

            <div className="space-y-2">
              <Label>Date of Birth (Private)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Day"
                  min="1"
                  max="31"
                  required
                />
                <Input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="Month"
                  min="1"
                  max="12"
                  required
                />
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">You must be 18 or older to use this app</p>
            </div>

            <Button type="submit" className="w-full" disabled={createProfile.isPending}>
              {createProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
