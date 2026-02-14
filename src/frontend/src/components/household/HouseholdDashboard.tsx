import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PendingInvitesList from './PendingInvitesList';
import HouseholdInvitePanel from './HouseholdInvitePanel';

export default function HouseholdDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Household Budget</h1>
        <p className="text-muted-foreground mt-1">Manage your household finances together</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Household budget retrieval and member management methods are not yet exposed in the backend interface.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>Invitations you've received</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitesList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite to Household</CardTitle>
            <CardDescription>Invite someone to join your household</CardDescription>
          </CardHeader>
          <CardContent>
            <HouseholdInvitePanel />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Household Overview</CardTitle>
          <CardDescription>Combined household budget and member details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Household budget view will be available once backend methods are exposed in the interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
