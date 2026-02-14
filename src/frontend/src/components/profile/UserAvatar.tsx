import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ExternalBlob } from '../../backend';

interface UserAvatarProps {
  username?: string;
  avatar?: ExternalBlob;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ username, avatar, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-20 w-20 text-xl',
  };

  const initials = username
    ? username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const avatarUrl = avatar?.getDirectURL();

  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
