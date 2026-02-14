import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../../hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wallet, Heart, Users, Settings, LogOut, Shield, Bell, TrendingUp, CheckSquare, UtensilsCrossed, ShoppingCart, Trophy, MessageSquare, Moon, Sun, Flag } from 'lucide-react';
import PersonalBudgetDashboard from '../budget/PersonalBudgetDashboard';
import HouseholdDashboard from '../household/HouseholdDashboard';
import ProfileSettings from '../profile/ProfileSettings';
import StaffDirectory from '../../pages/staff/StaffDirectory';
import StaffModeration from '../../pages/staff/StaffModeration';
import UserAvatar from '../profile/UserAvatar';
import RenewalRemindersModule from '../reminders/RenewalRemindersModule';
import SavingsCoachModule from '../savings-coach/SavingsCoachModule';
import MembershipCheckerModule from '../memberships/MembershipCheckerModule';
import WellbeingFitnessModule from '../wellbeing/WellbeingFitnessModule';
import MealPlanningModule from '../meal-planning/MealPlanningModule';
import ShoppingListsModule from '../shopping/ShoppingListsModule';
import AchievementsScreen from '../achievements/AchievementsScreen';
import CommunityModule from '../community/CommunityModule';

type View = 'budget' | 'household' | 'reminders' | 'savings-coach' | 'membership-checker' | 'wellbeing' | 'meal-planning' | 'shopping' | 'achievements' | 'community' | 'settings' | 'staff' | 'moderation';

export default function AppLayout() {
  const [currentView, setCurrentView] = useState<View>('budget');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navigation = [
    { id: 'budget' as View, label: 'Budget', icon: Wallet, section: 'Finance' },
    { id: 'household' as View, label: 'Household', icon: Users, section: 'Finance' },
    { id: 'reminders' as View, label: 'Reminders', icon: Bell, section: 'Finance' },
    { id: 'savings-coach' as View, label: 'Savings Coach', icon: TrendingUp, section: 'Finance' },
    { id: 'membership-checker' as View, label: 'Membership Checker', icon: CheckSquare, section: 'Finance' },
    { id: 'wellbeing' as View, label: 'Wellbeing & Fitness', icon: Heart, section: 'Wellbeing' },
    { id: 'meal-planning' as View, label: 'Meal Planning', icon: UtensilsCrossed, section: 'Wellbeing' },
    { id: 'shopping' as View, label: 'Shopping Lists', icon: ShoppingCart, section: 'Wellbeing' },
    { id: 'achievements' as View, label: 'Achievements', icon: Trophy, section: 'Gamification' },
    { id: 'community' as View, label: 'Community', icon: MessageSquare, section: 'Social' },
  ];

  const groupedNav = navigation.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  const NavContent = () => (
    <nav className="space-y-6">
      {Object.entries(groupedNav).map(([section, items]) => (
        <div key={section}>
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {section}
          </h3>
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t space-y-1">
        {isAdmin && (
          <>
            <button
              onClick={() => {
                setCurrentView('moderation');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                currentView === 'moderation'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <Flag className="h-4 w-4" />
              <span className="font-medium">Moderation</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('staff');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                currentView === 'staff'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="font-medium">Staff Directory</span>
            </button>
          </>
        )}

        <button
          onClick={() => {
            setCurrentView('settings');
            setMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            currentView === 'settings'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
                <div className="mb-6">
                  <img 
                    src="/assets/generated/wgl-bewellbalanced-logo.dim_1024x1024.png" 
                    alt="WGL BeWellBalanced" 
                    className="h-12 w-12"
                  />
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/wgl-bewellbalanced-logo.dim_1024x1024.png" 
                alt="WGL BeWellBalanced" 
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold hidden sm:block">WGL BeWellBalanced</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <UserAvatar username={userProfile?.publicProfile.username} avatar={userProfile?.publicProfile.avatar} size="sm" />
              <span className="text-sm font-medium">{userProfile?.publicProfile.username}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-4rem)] border-r p-4 overflow-y-auto">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {currentView === 'budget' && <PersonalBudgetDashboard />}
          {currentView === 'household' && <HouseholdDashboard />}
          {currentView === 'reminders' && <RenewalRemindersModule />}
          {currentView === 'savings-coach' && <SavingsCoachModule />}
          {currentView === 'membership-checker' && <MembershipCheckerModule />}
          {currentView === 'wellbeing' && <WellbeingFitnessModule />}
          {currentView === 'meal-planning' && <MealPlanningModule />}
          {currentView === 'shopping' && <ShoppingListsModule />}
          {currentView === 'achievements' && <AchievementsScreen />}
          {currentView === 'community' && <CommunityModule />}
          {currentView === 'settings' && <ProfileSettings />}
          {currentView === 'moderation' && isAdmin && <StaffModeration />}
          {currentView === 'staff' && isAdmin && <StaffDirectory />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
