import { useState } from 'react';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

export interface EmptyStateProps {
  title: string;
  description: string;
  videoTitle?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  videoTitle = 'How to get started',
  videoUrl,
  videoThumbnail,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  const theme = useTheme();
  const [videoOpen, setVideoOpen] = useState(false);

  const handleOpenVideo = () => {
    if (videoUrl) {
      setVideoOpen(true);
    }
  };

  const handleCloseVideo = () => {
    setVideoOpen(false);
  };

  const hasVideo = !!videoUrl;

  return (
    <Stack
      spacing={4}
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        maxWidth: 580,
        mx: 'auto',
      }}
    >
      {/* VIDEO / THUMBNAIL BOX */}
      <Box
        component={m.div}
        whileHover={{ scale: hasVideo ? 1.015 : 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleOpenVideo}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 2.5,
          overflow: 'hidden',
          cursor: hasVideo ? 'pointer' : 'default',
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: theme.customShadows?.z12,
          background: videoThumbnail
            ? `url(${videoThumbnail}) no-repeat center center/cover`
            : `linear-gradient(135deg, ${theme.vars.palette.background.neutral} 0%, ${varAlpha(theme.vars.palette.primary.mainChannel, 0.08)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Decorative Grid Patterns (if no thumbnail is uploaded) */}
        {!videoThumbnail && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.4,
              backgroundImage: `radial-gradient(${theme.vars.palette.primary.light} 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* Video Tutorial Thumbnail Overlay / Content */}
        {!videoThumbnail && (
          <Stack spacing={1.5} alignItems="center" sx={{ zIndex: 1, p: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: theme.customShadows?.z8,
                color: 'primary.main',
                position: 'relative',
              }}
            >
              {/* Pulsing ring animation if video exists */}
              {hasVideo && (
                <Box
                  component={m.div}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: `2px solid ${theme.vars.palette.primary.main}`,
                  }}
                />
              )}
              <Iconify
                icon={
                  hasVideo ? 'solar:play-circle-bold' : 'solar:video-frame-play-horizontal-bold'
                }
                width={24}
                sx={{ ml: hasVideo ? 0.5 : 0 }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {videoTitle}
              </Typography>
              {hasVideo && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.2 }}
                >
                  Click to play video tutorial
                </Typography>
              )}
            </Box>
          </Stack>
        )}

        {/* Thumbnail specific play button (if custom image background is provided) */}
        {videoThumbnail && hasVideo && (
          <Box
            sx={{
              position: 'absolute',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.9),
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.customShadows?.z12,
              backdropFilter: 'blur(4px)',
              transition: theme.transitions.create(['transform', 'background-color']),
              '&:hover': {
                transform: 'scale(1.08)',
                bgcolor: 'primary.main',
              },
            }}
          >
            <Iconify icon="solar:play-circle-bold" width={26} sx={{ ml: 0.5 }} />
          </Box>
        )}
      </Box>

      {/* TEXT CONTENT */}
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.6, maxWidth: 440, mx: 'auto' }}
        >
          {description}
        </Typography>
      </Stack>

      {/* CORE ACTIONS */}
      <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 280, mt: 1 }}>
        {actionLabel && onAction && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onAction}
            sx={{
              fontWeight: 800,
              borderRadius: 1.25,
              py: 1.25,
              boxShadow: `0 8px 20px 0 ${varAlpha(theme.vars.palette.primary.mainChannel, 0.24)}`,
            }}
          >
            {actionLabel}
          </Button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <Button
            variant="text"
            color="inherit"
            onClick={onSecondaryAction}
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
            }}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </Stack>

      {/* RESPONSIVE VIDEO DIALOG */}
      {hasVideo && (
        <Dialog
          open={videoOpen}
          onClose={handleCloseVideo}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'black',
              boxShadow: theme.customShadows?.z24,
              borderRadius: 2,
              overflow: 'hidden',
            },
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <IconButton
              onClick={handleCloseVideo}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              <Iconify icon="solar:close-circle-bold" width={24} />
            </IconButton>
            <iframe
              src={videoUrl}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Dialog>
      )}
    </Stack>
  );
}
