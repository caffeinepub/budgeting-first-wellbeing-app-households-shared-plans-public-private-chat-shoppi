import { useState, useEffect } from 'react';
import { useGetPersonalBudget, useSavePersonalBudget } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import BudgetEntriesEditor from './BudgetEntriesEditor';

export default function PersonalBudgetDashboard() {
  const { data: budget } = useGetPersonalBudget();
  const saveBudget = useSavePersonalBudget();

  const [netIncome, setNetIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goals, setGoals] = useState('');

  useEffect(() => {
    if (budget) {
      setNetIncome(budget.netIncome.toString());
      setExpenses(budget.expenses.toString());
      setGoals(budget.goals);
    }
  }, [budget]);

  const handleSave = async () => {
    try {
      await saveBudget.mutateAsync({
        netIncome: parseFloat(netIncome) || 0,
        expenses: parseFloat(expenses) || 0,
        goals: goals,
      });
      toast.success('Budget saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save budget');
    }
  };

  const remaining = (parseFloat(netIncome) || 0) - (parseFloat(expenses) || 0);
  const progressPercentage = parseFloat(netIncome) > 0 
    ? Math.min(((parseFloat(expenses) || 0) / parseFloat(netIncome)) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Personal Budget</h1>
        <p className="text-muted-foreground">Manage your income, expenses, and financial goals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${parseFloat(netIncome) || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${parseFloat(expenses) || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${remaining.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Your spending vs income</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage.toFixed(1)}% of income spent
          </p>
        </CardContent>
      </Card>

      {/* Budget Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Budget</CardTitle>
          <CardDescription>Enter your income and expenses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="netIncome">Net Income ($)</Label>
              <Input
                id="netIncome"
                type="number"
                step="0.01"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Total Expenses ($)</Label>
              <Input
                id="expenses"
                type="number"
                step="0.01"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Financial Goals</Label>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Describe your financial goals and targets..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saveBudget.isPending}>
            {saveBudget.isPending ? 'Saving...' : 'Save Budget'}
          </Button>
        </CardContent>
      </Card>

      {/* Budget Entries Editor */}
      <BudgetEntriesEditor 
        onTotalsChange={(income, exp) => {
          setNetIncome(income.toString());
          setExpenses(exp.toString());
        }}
      />
    </div>
  );
}
