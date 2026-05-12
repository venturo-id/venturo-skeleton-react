// RichTextEditor - TipTap-based rich text editor for Timebox

import { useCallback } from 'react';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { EditorToolbar } from './editor-toolbar';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: number;
  maxHeight?: number;
  onKeyDown?: (event: KeyboardEvent) => boolean;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Type something...',
  editable = true,
  minHeight = 100,
  maxHeight = 300,
  onKeyDown,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor',
      },
      handleKeyDown: (view, event) => {
        if (onKeyDown) {
          return onKeyDown(event);
        }
        return false;
      },
    },
  });

  const handleSetLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Toolbar */}
      <EditorToolbar
        editor={editor}
        onSetLink={handleSetLink}
      />

      {/* Divider */}
      <Divider />

      {/* Editor Content */}
      <Box
        sx={{
          position: 'relative',
          '& .ProseMirror': {
            minHeight,
            maxHeight,
            overflowY: 'auto',
            padding: '12px 16px',
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Styled Components
// ----------------------------------------------------------------------

// The TipTap editor needs some base styles
// These should be added to the global CSS or styled component
export const richTextEditorStyles = `
  .rich-text-editor {
    font-size: 14px;
    line-height: 1.6;
    outline: none;
  }

  .rich-text-editor p {
    margin: 0 0 8px 0;
  }

  .rich-text-editor p:last-child {
    margin-bottom: 0;
  }

  .rich-text-editor h1,
  .rich-text-editor h2,
  .rich-text-editor h3 {
    margin: 16px 0 8px 0;
    font-weight: 600;
  }

  .rich-text-editor h1:first-child,
  .rich-text-editor h2:first-child,
  .rich-text-editor h3:first-child {
    margin-top: 0;
  }

  .rich-text-editor ul,
  .rich-text-editor ol {
    padding-left: 24px;
    margin: 8px 0;
  }

  .rich-text-editor li {
    margin: 4px 0;
  }

  .rich-text-editor ul {
    list-style-type: disc;
  }

  .rich-text-editor ol {
    list-style-type: decimal;
  }

  .rich-text-editor a {
    color: #3B82F6;
    text-decoration: underline;
    cursor: pointer;
  }

  .rich-text-editor a:hover {
    color: #2563EB;
  }

  .rich-text-editor blockquote {
    border-left: 3px solid #ddd;
    margin: 12px 0;
    padding-left: 12px;
    color: #666;
  }

  .rich-text-editor code {
    background: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  .rich-text-editor pre {
    background: #f4f4f4;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }

  .rich-text-editor pre code {
    background: none;
    padding: 0;
  }

  .rich-text-editor .text-link {
    color: #3B82F6;
    text-decoration: underline;
  }

  .rich-text-editor .ProseMirror-focused {
    outline: none;
  }

  .rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;
