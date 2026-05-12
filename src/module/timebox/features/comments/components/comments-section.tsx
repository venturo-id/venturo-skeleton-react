// CommentsSection - Display and manage comments for a task

import type { Comment } from 'src/module/timebox/types';

import dayjs from 'dayjs';
import { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { CommentInput } from './comment-input';

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  currentUserId?: string;
}

// ----------------------------------------------------------------------
// Helper: Format relative time
// ----------------------------------------------------------------------

function formatRelativeTime(dateStr: string): string {
  const date = dayjs(dateStr);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');

  if (diffDays < 7) {
    return date.fromNow();
  }

  return date.format('MMM D, YYYY');
}

// ----------------------------------------------------------------------
// Component: Single Comment
// ----------------------------------------------------------------------

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
}

function CommentItem({ comment, currentUserId, onDelete, onEdit }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = currentUserId === comment.authorId;

  const handleSave = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': {
          borderBottom: 'none',
        },
      }}
    >
      <Stack direction="row" spacing={1.5}>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: comment.authorAvatar ? 'transparent' : 'primary.main',
          }}
          src={comment.authorAvatar ?? undefined}
        >
          {!comment.authorAvatar && comment.authorName?.charAt(0).toUpperCase()}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.authorName || 'Unknown'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              •
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {formatRelativeTime(comment.createdAt)}
            </Typography>
            {comment.updatedAt !== comment.createdAt && (
              <>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  edited
                </Typography>
              </>
            )}
          </Stack>

          {isEditing ? (
            <Box>
              <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  component="textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  sx={{
                    width: '100%',
                    minWidth: 300,
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    resize: 'vertical',
                    minHeight: 60,
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Typography
                  variant="button"
                  onClick={handleSave}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'primary.main',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </Typography>
                <Typography
                  variant="button"
                  onClick={handleCancel}
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {comment.content}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {(isOwner || onDelete) && !isEditing && (
          <Box>
            <Stack direction="row" spacing={0.25}>
              {isOwner && (
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{ p: 0.5 }}
                >
                  <Iconify icon="solar:pen-bold" width={14} />
                </IconButton>
              )}
              {(isOwner || onDelete) && (
                <IconButton
                  size="small"
                  onClick={() => {
                    if (window.confirm('Delete this comment?')) {
                      onDelete?.(comment.id);
                    }
                  }}
                  sx={{ p: 0.5 }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={14} />
                </IconButton>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Component: CommentsSection
// ----------------------------------------------------------------------

export function CommentsSection({
  comments,
  onAddComment,
  onDeleteComment,
  onEditComment,
  currentUserId,
}: CommentsSectionProps) {
  const { t } = useTranslate('timebox.tasks');

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {t('comments')} ({comments.length})
        </Typography>
      </Box>

      <Divider />

      {/* Comments List */}
      {comments.length > 0 ? (
        <Box>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            py: 4,
            textAlign: 'center',
            color: 'text.disabled',
          }}
        >
          <Typography variant="body2">{t('noComments')}</Typography>
        </Box>
      )}

      {/* Add Comment Input */}
      <Box sx={{ px: 2, pb: 2 }}>
        <CommentInput
          onSubmit={onAddComment}
          placeholder={t('writeComment')}
        />
      </Box>
    </Box>
  );
}
