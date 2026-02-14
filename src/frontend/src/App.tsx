import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useProfile';
import LoginScreen from './components/auth/LoginScreen';
import OnboardingFlow from './components/profile/OnboardingFlow';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/theme/ThemeProvider';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading state during initialization
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show onboarding if profile is missing (only after profile fetch is complete)
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ThemeProvider>
        <OnboardingFlow />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show main app
  return (
    <ThemeProvider>
      <AppLayout />
      <Toaster />
    </ThemeProvider>
  );
}
