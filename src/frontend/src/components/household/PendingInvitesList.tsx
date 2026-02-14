import { useGetPendingInvites, useAcceptHouseholdInvite, useDeclineHouseholdInvite } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Check, X } from 'lucide-react';

export default function PendingInvitesList() {
  const { data: invites } = useGetPendingInvites();
  const acceptInvite = useAcceptHouseholdInvite();
  const declineInvite = useDeclineHouseholdInvite();

  if (!invites || invites.length === 0) {
    return null;
  }

  const handleAccept = async (inviteId: string) => {
    try {
      await acceptInvite.mutateAsync(inviteId);
      toast.success('Household invite accepted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept invite');
    }
  };

  const handleDecline = async (inviteId: string) => {
    try {
      await declineInvite.mutateAsync(inviteId);
      toast.success('Invite declined');
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline invite');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pending Invites
        </CardTitle>
        <CardDescription>You have household invitations waiting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invites.map(([inviteId, invite]) => (
            <div key={inviteId} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{invite.inviterUsername}</p>
                <p className="text-sm text-muted-foreground">wants to create a household with you</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleAccept(inviteId)}
                  disabled={acceptInvite.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDecline(inviteId)}
                  disabled={declineInvite.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
