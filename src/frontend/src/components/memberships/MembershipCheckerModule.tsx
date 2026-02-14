import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function MembershipCheckerModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membership Checker</h1>
          <p className="text-muted-foreground mt-1">Evaluate your subscriptions and memberships</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Membership
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> This tool provides general guidance only and is not financial advice. Always consider your personal circumstances when making decisions about subscriptions.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Membership storage and checker analysis are not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Your Memberships
          </CardTitle>
          <CardDescription>Track and evaluate your subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No memberships tracked yet. Add your first membership to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
