import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AchievementsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements & Trophies</h1>
        <p className="text-muted-foreground mt-1">Track your progress and unlock rewards</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend functionality pending:</strong> Achievements storage and unlock tracking are not yet implemented in the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Achievements
          </CardTitle>
          <CardDescription>Unlock achievements by completing goals and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 1, name: 'First Budget', desc: 'Create your first budget', locked: true },
              { id: 2, name: 'Savings Goal', desc: 'Set a savings goal', locked: true },
              { id: 3, name: 'Wellbeing Warrior', desc: 'Complete 5 fitness activities', locked: true },
              { id: 4, name: 'Meal Planner', desc: 'Create your first meal plan', locked: true },
              { id: 5, name: 'Community Member', desc: 'Send your first message', locked: true },
            ].map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.locked ? 'bg-muted/50' : 'bg-accent'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {achievement.locked ? (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Trophy className="h-6 w-6 text-primary" />
                  )}
                  <h3 className="font-semibold">{achievement.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
