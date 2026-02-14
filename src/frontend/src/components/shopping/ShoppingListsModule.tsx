import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ShoppingListsModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Lists</h1>
          <p className="text-muted-foreground mt-1">Manage your shopping with smart suggestions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Shopping lists storage and smart nudges are not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Shopping Lists
          </CardTitle>
          <CardDescription>Create lists and get smart suggestions for healthier and cheaper alternatives</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No shopping lists yet. Create your first list to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
