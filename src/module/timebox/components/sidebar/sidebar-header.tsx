import type { SidebarHeaderProps } from './types';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';
import { useAuthContext } from 'src/module/core/features/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------
// Helper Component: User Avatar
// ----------------------------------------------------------------------

interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  size?: number;
  sx?: object;
}

function UserAvatar({ name, avatar, size = 32, sx }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
        backgroundImage: avatar ? `url(${avatar})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...sx,
      }}
    >
      {!avatar && initials}
    </Box>
  );
}

// ----------------------------------------------------------------------
// SidebarHeader Component
// ----------------------------------------------------------------------

export function SidebarHeader({
  userName,
  userAvatar,
  userEmail,
  notificationCount = 0,
  onMenuOpen,
  onNotificationClick,
  onHideSidebar,
}: SidebarHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Use auth user data if not provided
  const displayName = userName || user?.full_name || user?.username || 'User';

  const handleUserClick = () => {
    setMenuOpen((prev) => !prev);
    onMenuOpen?.();
  };

  const handleNotificationClick = () => {
    navigate('/app/notifications');
    onNotificationClick?.();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        height: 58,
        flexShrink: 0,
      }}
    >
      {/* User button */}
      <Box
        ref={anchorRef}
        onClick={handleUserClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          cursor: 'pointer',
          transition: (theme) =>
            theme.transitions.create(['background-color', 'transform'], {
              duration: theme.transitions.duration.shortest,
            }),
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <UserAvatar name={displayName} avatar={userAvatar} size={32} />
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'text.primary',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayName}
        </Typography>
        <Iconify
          icon="solar:double-alt-arrow-down-bold-duotone"
          width={14}
          sx={{
            color: 'text.secondary',
            transition: (theme) => theme.transitions.create('transform'),
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </Box>

      {/* Right actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* Notification bell */}
        <IconButton
          onClick={handleNotificationClick}
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
          }}
        >
          <Badge badgeContent={notificationCount} color="warning" invisible={notificationCount === 0}>
            <Iconify icon="solar:bell-bing-bold-duotone" width={20} />
          </Badge>
        </IconButton>

        {/* Hide sidebar button */}
        <IconButton
          onClick={onHideSidebar}
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
          }}
        >
          <Iconify icon="solar:double-alt-arrow-right-bold-duotone" width={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
