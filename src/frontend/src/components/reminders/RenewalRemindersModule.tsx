import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function RenewalRemindersModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Renewal Reminders</h1>
          <p className="text-muted-foreground mt-1">Track subscriptions, bills, and recurring payments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Renewal reminders storage and retrieval are not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your Reminders
          </CardTitle>
          <CardDescription>Upcoming renewals and recurring payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No reminders yet. Add your first reminder to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
