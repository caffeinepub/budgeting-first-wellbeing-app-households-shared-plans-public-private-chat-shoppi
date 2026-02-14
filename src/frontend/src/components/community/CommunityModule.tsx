import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mail, Users, Shield } from 'lucide-react';
import { useIsCallerAdmin } from '../../hooks/useProfile';
import GlobalChatPanel from './chat/GlobalChatPanel';
import PrivateMessagesPanel from './chat/PrivateMessagesPanel';
import StaffGroupChatPanel from './chat/StaffGroupChatPanel';
import HouseholdChatPanel from './chat/HouseholdChatPanel';

export default function CommunityModule() {
  const [activeTab, setActiveTab] = useState('global');
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground mt-1">Connect with others and share your journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="global">
            <MessageSquare className="h-4 w-4 mr-2" />
            Global
          </TabsTrigger>
          <TabsTrigger value="private">
            <Mail className="h-4 w-4 mr-2" />
            Private
          </TabsTrigger>
          <TabsTrigger value="household">
            <Users className="h-4 w-4 mr-2" />
            Household
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="staff">
              <Shield className="h-4 w-4 mr-2" />
              Staff
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <GlobalChatPanel />
        </TabsContent>

        <TabsContent value="private" className="space-y-4">
          <PrivateMessagesPanel />
        </TabsContent>

        <TabsContent value="household" className="space-y-4">
          <HouseholdChatPanel />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="staff" className="space-y-4">
            <StaffGroupChatPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
