import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Pause, Play, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { 
  useGetPrivateConversations, 
  useGetPrivateMessages, 
  useSendPrivateMessage,
  useGetConversationStatus,
  usePauseConversation,
  useUnpauseConversation
} from '../../../hooks/useChat';
import { useGetCallerUserProfile } from '../../../hooks/useProfile';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import MessageRow from './MessageRow';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PrivateMessagesPanel() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { data: conversations, isLoading: conversationsLoading, error: conversationsError } = useGetPrivateConversations();
  const { data: messages, isLoading: messagesLoading } = useGetPrivateMessages(selectedConversation);
  const { data: conversationStatus } = useGetConversationStatus(selectedConversation);
  const sendMessage = useSendPrivateMessage();
  const pauseConversation = usePauseConversation();
  const unpauseConversation = useUnpauseConversation();
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedConversation) return;
    
    await sendMessage.mutateAsync({ 
      recipient: selectedConversation, 
      content: message.trim() 
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePauseToggle = async () => {
    if (!selectedConversation) return;
    
    if (conversationStatus?.paused) {
      await unpauseConversation.mutateAsync(selectedConversation);
    } else {
      await pauseConversation.mutateAsync(selectedConversation);
    }
  };

  const canSendMessage = selectedConversation && !conversationStatus?.paused;
  const isPausedByOther = conversationStatus?.paused && conversationStatus?.pausedBy?.toString() !== currentUserPrincipal;

  if (conversationsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Private Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              Private messaging is temporarily unavailable. The backend chat functionality is not yet deployed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conv: any) => {
                  const [otherUserPrincipal, lastMessage, timestamp] = conv;
                  const isSelected = selectedConversation === otherUserPrincipal.toString();
                  
                  return (
                    <button
                      key={otherUserPrincipal.toString()}
                      onClick={() => setSelectedConversation(otherUserPrincipal.toString())}
                      className={`w-full text-left p-4 hover:bg-accent transition-colors ${
                        isSelected ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="font-medium text-sm truncate">
                        {otherUserPrincipal.toString().slice(0, 10)}...
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {lastMessage}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 px-4 text-center text-muted-foreground text-sm">
                No conversations yet
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="md:col-span-2 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedConversation ? 'Messages' : 'Select a conversation'}
          </CardTitle>
          {selectedConversation && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseToggle}
              disabled={pauseConversation.isPending || unpauseConversation.isPending}
            >
              {conversationStatus?.paused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {selectedConversation ? (
            <>
              <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-2 py-4">
                    {messages.map((msg: any) => (
                      <MessageRow
                        key={msg.id}
                        messageId={msg.id}
                        senderUsername={msg.senderUsername}
                        senderAvatar={null}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        location="private"
                        isOwnMessage={msg.sender.toString() === currentUserPrincipal}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </ScrollArea>

              <div className="border-t p-4">
                {isPausedByOther ? (
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      This conversation has been paused. You cannot send messages at this time.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!canSendMessage || sendMessage.isPending}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={!message.trim() || !canSendMessage || sendMessage.isPending}
                      size="icon"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
