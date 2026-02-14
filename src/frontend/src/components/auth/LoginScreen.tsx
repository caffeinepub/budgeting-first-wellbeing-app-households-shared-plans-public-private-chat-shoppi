import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="container mx-auto">
          <img 
            src="/assets/generated/wgl-bewellbalanced-lockup.dim_1600x400.png" 
            alt="WGL BeWellBalanced" 
            className="h-16 object-contain object-left"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Take Control of Your Life
              </h2>
              <p className="text-lg text-muted-foreground">
                A comprehensive platform to manage your budget, track your wellness goals, plan meals, and connect with a supportive community. Built for adults who want to make positive changes.
              </p>
            </div>
            <img 
              src="/assets/generated/hero-illustration.dim_1600x900.png" 
              alt="Hero illustration" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Login Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Welcome</CardTitle>
                <CardDescription>
                  Sign in to access your personal budgeting dashboard, wellness tools, meal planning, and community features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError.message}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={login} 
                  disabled={isLoggingIn}
                  className="w-full"
                  size="lg"
                >
                  {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This application is restricted to users aged 18 and over.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">caffeine.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
