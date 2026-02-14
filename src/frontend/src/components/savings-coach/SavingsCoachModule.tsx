import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function SavingsCoachModule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Savings Coach</h1>
        <p className="text-muted-foreground mt-1">Get personalized recommendations to optimize your spending</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> This tool provides general guidance only and is not financial advice. Always consult a qualified financial advisor for personalized recommendations.
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Savings coach analysis is not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Start Your Analysis
          </CardTitle>
          <CardDescription>Answer a few questions to get personalized savings recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">How it works</p>
              <p className="text-sm text-muted-foreground mt-1">
                Our savings coach analyzes your budget, recurring bills, and memberships to identify opportunities for savings. You'll receive actionable recommendations with clear explanations.
              </p>
            </div>
          </div>
          <Button size="lg" className="w-full">
            Run Savings Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
