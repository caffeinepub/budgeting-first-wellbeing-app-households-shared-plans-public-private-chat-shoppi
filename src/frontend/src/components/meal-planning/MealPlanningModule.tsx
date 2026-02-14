import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function MealPlanningModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meal Planning</h1>
          <p className="text-muted-foreground mt-1">Plan meals and estimate calories for your household</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Meal Plan
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Meal planning storage and household alignment are not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Your Meal Plans
          </CardTitle>
          <CardDescription>Create and manage meal plans for you and your household</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No meal plans yet. Create your first meal plan to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
