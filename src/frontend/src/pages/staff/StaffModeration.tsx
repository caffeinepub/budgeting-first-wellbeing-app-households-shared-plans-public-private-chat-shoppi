import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetFlaggedMessages, useDeleteMessage, useResolveFlaggedMessage } from '../../hooks/useModeration';
import { useIsCallerAdmin } from '../../hooks/useProfile';
import { Trash2, CheckCircle, Loader2, Flag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StaffModeration() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: flaggedMessages, isLoading, error } = useGetFlaggedMessages();
  const deleteMessage = useDeleteMessage();
  const resolveFlag = useResolveFlaggedMessage();
  const [activeTab, setActiveTab] = useState('pending');

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to access this page. Staff access required.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (messageId: string, location: string) => {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      await deleteMessage.mutateAsync({ 
        messageId, 
        location: location.replace('#', '') as any 
      });
    }
  };

  const handleResolve = async (flagId: string) => {
    await resolveFlag.mutateAsync(flagId);
  };

  const getLocationBadge = (location: any) => {
    const locationStr = Object.keys(location)[0].replace('#', '');
    const colors: Record<string, string> = {
      global: 'bg-blue-500',
      private: 'bg-purple-500',
      household: 'bg-green-500',
      staffGroup: 'bg-orange-500',
    };
    
    return (
      <Badge className={colors[locationStr] || 'bg-gray-500'}>
        {locationStr}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Moderation</h1>
          <p className="text-muted-foreground mt-1">Review and manage flagged content</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Moderation tools are temporarily unavailable. The backend moderation functionality is not yet deployed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Moderation</h1>
        <p className="text-muted-foreground mt-1">Review and manage flagged content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            <Flag className="h-4 w-4 mr-2" />
            Pending Flags
          </TabsTrigger>
          <TabsTrigger value="all">All Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Messages</CardTitle>
              <CardDescription>
                Messages that have been flagged by users for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : flaggedMessages && flaggedMessages.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {flaggedMessages.map((item: any) => {
                      const [flagId, message, reason, location, flaggedAt] = item;
                      const date = new Date(Number(flaggedAt) / 1000000);
                      
                      return (
                        <Card key={flagId} className="border-l-4 border-l-warning">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">
                                    {message.senderUsername}
                                  </CardTitle>
                                  {getLocationBadge(location)}
                                </div>
                                <CardDescription>
                                  Flagged on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Message:</p>
                              <p className="text-sm bg-muted p-3 rounded-md">
                                {message.content}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Reason for flag:</p>
                              <p className="text-sm text-muted-foreground">
                                {reason}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(message.id, Object.keys(location)[0])}
                                disabled={deleteMessage.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Message
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolve(flagId)}
                                disabled={resolveFlag.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve Flag
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No flagged messages at this time
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Flags</CardTitle>
              <CardDescription>
                Complete history of flagged messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                All flags view coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
