import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MoreVertical, Flag, Trash2 } from 'lucide-react';
import { useFlagMessage, useDeleteMessage } from '../../../hooks/useModeration';
import { useIsCallerAdmin } from '../../../hooks/useProfile';
import UserAvatar from '../../profile/UserAvatar';

interface MessageRowProps {
  messageId: string;
  senderUsername: string;
  senderAvatar?: any;
  content: string;
  timestamp: bigint;
  location: 'global' | 'private' | 'household' | 'staffGroup';
  isOwnMessage: boolean;
}

export default function MessageRow({
  messageId,
  senderUsername,
  senderAvatar,
  content,
  timestamp,
  location,
  isOwnMessage,
}: MessageRowProps) {
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const { data: isAdmin } = useIsCallerAdmin();
  const flagMessage = useFlagMessage();
  const deleteMessage = useDeleteMessage();

  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleFlag = async () => {
    if (!flagReason.trim()) return;
    await flagMessage.mutateAsync({ messageId, reason: flagReason, location });
    setFlagDialogOpen(false);
    setFlagReason('');
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      await deleteMessage.mutateAsync({ messageId, location });
    }
  };

  return (
    <>
      <div className={`flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        <UserAvatar username={senderUsername} avatar={senderAvatar} size="sm" />
        
        <div className={`flex-1 min-w-0 ${isOwnMessage ? 'text-right' : ''}`}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm">{senderUsername}</span>
            <span className="text-xs text-muted-foreground">{timeString}</span>
          </div>
          <p className="text-sm break-words">{content}</p>
        </div>

        {!isOwnMessage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFlagDialogOpen(true)}>
                <Flag className="h-4 w-4 mr-2" />
                Flag Message
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Message
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Message</DialogTitle>
            <DialogDescription>
              Report this message to staff for review. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Why are you flagging this message?"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleFlag} 
              disabled={!flagReason.trim() || flagMessage.isPending}
            >
              {flagMessage.isPending ? 'Flagging...' : 'Flag Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
