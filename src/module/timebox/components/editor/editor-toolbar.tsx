// EditorToolbar - Toolbar for RichTextEditor

import type { Editor } from '@tiptap/react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import { Iconify, type IconifyName } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface EditorToolbarProps {
  editor: Editor | null;
  onSetLink?: () => void;
}

// ----------------------------------------------------------------------
// Toolbar Button Component
// ----------------------------------------------------------------------

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  tooltip: string;
  onClick: () => void;
  icon: IconifyName;
  size?: number;
}

function ToolbarButton({ active, disabled, tooltip, onClick, icon, size = 18 }: ToolbarButtonProps) {
  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          p: 0.75,
          bgcolor: active ? 'action.selected' : 'transparent',
          '&:hover': {
            bgcolor: active ? 'action.selected' : 'action.hover',
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        }}
      >
        <Iconify icon={icon} width={size} />
      </IconButton>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function EditorToolbar({ editor, onSetLink }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 1,
        py: 0.5,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        flexWrap: 'wrap',
      }}
    >
      {/* Bold */}
      <ToolbarButton
        active={editor.isActive('bold')}
        tooltip="Bold (Cmd+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon="solar:letter-bold"
      />

      {/* Italic */}
      <ToolbarButton
        active={editor.isActive('italic')}
        tooltip="Italic (Cmd+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon="solar:letter-unread-bold"
      />

      {/* Underline */}
      <ToolbarButton
        active={editor.isActive('underline')}
        tooltip="Underline (Cmd+U)"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        icon="solar:letter-outline"
      />

      {/* Strike */}
      <ToolbarButton
        active={editor.isActive('strike')}
        tooltip="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon="solar:close-circle-bold"
      />

      {/* Code */}
      <ToolbarButton
        active={editor.isActive('code')}
        tooltip="Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon="solar:file-text-bold"
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* H1 */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 1 })}
        tooltip="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon="solar:letter-bold"
      />

      {/* H2 */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        tooltip="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon="solar:double-alt-arrow-up-bold-duotone"
      />

      {/* H3 */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        tooltip="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        icon="solar:double-alt-arrow-down-bold-duotone"
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Bullet List */}
      <ToolbarButton
        active={editor.isActive('bulletList')}
        tooltip="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon="solar:list-bold"
      />

      {/* Ordered List */}
      <ToolbarButton
        active={editor.isActive('orderedList')}
        tooltip="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon="solar:sort-by-time-bold-duotone"
      />

      {/* Blockquote */}
      <ToolbarButton
        active={editor.isActive('blockquote')}
        tooltip="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon="solar:reply-bold"
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Code Block */}
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        tooltip="Code Block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon="solar:file-text-bold"
      />

      {/* Link */}
      <ToolbarButton
        active={editor.isActive('link')}
        tooltip="Link"
        onClick={onSetLink ?? (() => editor.chain().focus().setLink({ href: '' }).run())}
        icon="eva:link-2-fill"
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Undo */}
      <ToolbarButton
        disabled={!editor.can().undo()}
        tooltip="Undo (Cmd+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        icon="solar:double-alt-arrow-right-bold-duotone"
      />

      {/* Redo */}
      <ToolbarButton
        disabled={!editor.can().redo()}
        tooltip="Redo (Cmd+Shift+Z)"
        onClick={() => editor.chain().focus().redo().run()}
        icon="solar:forward-bold"
      />
    </Box>
  );
}
