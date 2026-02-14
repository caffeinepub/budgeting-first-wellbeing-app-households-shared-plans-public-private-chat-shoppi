import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

type Entry = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
};

interface BudgetEntriesEditorProps {
  onTotalsChange: (totalIncome: number, totalExpenses: number) => void;
}

export default function BudgetEntriesEditor({ onTotalsChange }: BudgetEntriesEditorProps) {
  const { identity } = useInternetIdentity();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const storageKey = `budget_entries_${identity?.getPrincipal().toString()}`;

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
      } catch (e) {
        console.error('Failed to parse stored entries');
      }
    }
  }, [storageKey]);

  // Save entries to localStorage and update totals
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(entries));
    
    const totalIncome = entries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalExpenses = entries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    
    onTotalsChange(totalIncome, totalExpenses);
  }, [entries, storageKey, onTotalsChange]);

  const handleAdd = () => {
    if (!newDescription.trim() || !newAmount) return;

    const entry: Entry = {
      id: Date.now().toString(),
      type: newType,
      description: newDescription.trim(),
      amount: parseFloat(newAmount),
    };

    setEntries([...entries, entry]);
    setNewDescription('');
    setNewAmount('');
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const incomeEntries = entries.filter(e => e.type === 'income');
  const expenseEntries = entries.filter(e => e.type === 'expense');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Entries</CardTitle>
        <CardDescription>Track individual income and expense items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Entry */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold">Add Entry</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as 'income' | 'expense')}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g., Salary, Rent, Groceries"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                />
                <Button onClick={handleAdd} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Income List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-green-600">Income</h3>
          {incomeEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No income entries yet</p>
          ) : (
            <div className="space-y-2">
              {incomeEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-600">${entry.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-red-600">Expenses</h3>
          {expenseEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expense entries yet</p>
          ) : (
            <div className="space-y-2">
              {expenseEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-red-600">${entry.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
