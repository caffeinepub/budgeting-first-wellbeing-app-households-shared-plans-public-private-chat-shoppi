import { useState } from 'react';
import { useInviteToHousehold } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function HouseholdInvitePanel() {
  const [username, setUsername] = useState('');
  const inviteToHousehold = useInviteToHousehold();

  const handleInvite = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    try {
      await inviteToHousehold.mutateAsync(username.trim());
      toast.success(`Invite sent to ${username}`);
      setUsername('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invite');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite to Household
        </CardTitle>
        <CardDescription>
          Invite a partner or family member to share your household budget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inviteUsername">Username</Label>
          <Input
            id="inviteUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter their username"
          />
        </div>

        <Button onClick={handleInvite} disabled={inviteToHousehold.isPending}>
          {inviteToHousehold.isPending ? 'Sending...' : 'Send Invite'}
        </Button>
      </CardContent>
    </Card>
  );
}
