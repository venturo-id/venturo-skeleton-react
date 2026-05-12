# Component Audit: space-fe-timebox-v3 → venturo-skeleton-react

Audit lengkap semua components di space-fe-timebox-v3 untuk estimasi kompleksitas migrasi.

## 📊 Summary

| Complexity | Count | Est. Time | Description |
|------------|-------|-----------|-------------|
| **Low** | 8 | 1-2 hrs | Simple components, little/no Tailwind |
| **Medium** | 23 | 2-4 hrs | Moderate Tailwind usage, straightforward logic |
| **High** | 20 | 4-8 hrs | Heavy Tailwind, complex state, DnD, or TipTap |
| **Very High** | 5 | 1-2 days | Critical paths, TipTap integration, complex DnD |

**Total Files: 56 components**

---

## 🟢 Low Complexity (8 files)

Components dengan sedikit Tailwind, logika sederhana, bisa langsung konversi.

| File | Lines | Description | Est. Time |
|------|-------|-------------|-----------|
| `circle-checkbox.tsx` | 87 | Custom checkbox - sudah pakai inline styles | 1 hr |
| `add-task-modal-content.tsx` | 50 | Simple wrapper | 1 hr |
| `add-task-modal-footer.tsx` | 70 | Simple footer | 1 hr |
| `add-task-modal-popovers.tsx` | 70 | Popover container | 1 hr |
| `kanban-priority-popover.tsx` | 60 | Simple priority picker | 1 hr |
| `kanban-inline-section-popup.tsx` | 75 | Section selector | 1 hr |
| `emoji-picker.tsx` | 400 | Reusable emoji picker | 2 hrs |
| `task-detail-context.tsx` | 120 | Context provider | 1 hr |

**Total: ~10-12 hours**

---

## 🟡 Medium Complexity (23 files)

Components dengan Tailwind moderat, logika standar.

| File | Lines | Description | Est. Time |
|------|-------|-------------|-----------|
| `sidebar-header.tsx` | 349 | User menu, notifications, dark mode toggle | 3 hrs |
| `page-corner-menu.tsx` | ~150 | Page corner menu | 2 hrs |
| `task-form.tsx` | ~200 | Shared task form | 3 hrs |
| `projects-menu-content.tsx` | ~500 | Main sidebar content | 4 hrs |
| `search-palette.tsx` | ~400 | Cmd+K search palette | 3 hrs |
| `add-task-modal-action-bar.tsx` | 150 | Action bar with buttons | 2 hrs |
| `add-task-modal-context.tsx` | 80 | Context provider | 1 hr |
| `kanban-date-popover.tsx` | 180 | Date picker popover | 2 hrs |
| `kanban-inline-label-popup.tsx` | 85 | Inline label picker | 2 hrs |
| `kanban-inline-project-popup.tsx` | 260 | Inline project picker | 2 hrs |
| `kanban-project-popover.tsx` | 330 | Full project picker | 3 hrs |
| `kanban-reminder-popover.tsx` | 140 | Reminder picker | 2 hrs |
| `label-popover.tsx` | 120 | Label picker | 2 hrs |
| `move-to-popover.tsx` | 115 | Move to popover | 2 hrs |
| `share-popover.tsx` | 270 | Share popover | 3 hrs |
| `add-project-dialog.tsx` | 350 | Project create/edit dialog | 3 hrs |
| `create-team-dialog.tsx` | 270 | Team creation dialog | 3 hrs |
| `email-tasks-dialog.tsx` | 170 | Email tasks dialog | 2 hrs |
| `move-project-dialog.tsx` | 170 | Move project dialog | 2 hrs |
| `save-template-dialog.tsx` | 115 | Save template dialog | 2 hrs |
| `task-detail-header.tsx` | 180 | Task detail header | 2 hrs |
| `task-title-description.tsx` | 110 | Title/description wrapper | 2 hrs |
| `task-detail-utils.ts` | 50 | Utility functions | 1 hr |

**Total: ~55-65 hours (~1.5 weeks)**

---

## 🟠 High Complexity (20 files)

Components dengan banyak Tailwind, state kompleks, atau TipTap.

| File | Lines | Description | Est. Time |
|------|-------|-------------|-----------|
| `board-column.tsx` | 560 | Kanban column + DnD | 6 hrs |
| `board-section.tsx` | 800 | Section grouping + DnD | 6 hrs |
| `board.tsx` | 280 | Board container | 4 hrs |
| `list-view.tsx` | 1600 | Alternative list view + DnD | 8 hrs |
| `task-card.tsx` | 700 | Draggable task card | 6 hrs |
| `task-detail-modal/index.tsx` | 900 | Main task detail dialog | 8 hrs |
| `task-right-panel.tsx` | 580 | Properties panel | 6 hrs |
| `comments-section.tsx` | 320 | Comments list + input | 4 hrs |
| `subtasks-section.tsx` | 900 | Subtasks list + DnD | 6 hrs |
| `sortable-subtask-row.tsx` | 400 | Draggable subtask row | 4 hrs |
| `use-comment-state.ts` | 250 | Comment state hook | 3 hrs |
| `use-subtask-state.ts` | 520 | Subtask state hook | 4 hrs |
| `task-context-menu.tsx` | 90 | Right-click menu | 2 hrs |
| `comment-input-sticky.tsx` | 45 | Sticky comment input | 2 hrs |
| `kanban-add-task-modal.tsx` | 300 | Main add task modal | 4 hrs |
| `use-add-task-submit.ts` | 200 | Submit hook | 3 hrs |
| `use-add-task-title-handler.ts` | 290 | Title shortcuts handler | 3 hrs |
| `comments-dialog.tsx` | 480 | Comments dialog | 4 hrs |
| `markdown-content.tsx` | 60 | Markdown render | 2 hrs |
| `markdown-title.tsx` | 95 | Markdown title render | 2 hrs |

**Total: ~100-120 hours (~2.5-3 weeks)**

---

## 🔴 Very High Complexity (5 files)

Components kritis dengan TipTap rich text editor atau kompleksitas tinggi.

| File | Lines | Description | Est. Time |
|------|-------|-------------|-----------|
| `rich-input.tsx` | 780 | TipTap rich text input | 2 days |
| `tiptap-description.tsx` | 360 | TipTap description editor | 1 day |
| `description-input.tsx` | 720 | Description with TipTap | 1.5 days |
| `format-toolbar.tsx` | 380 | TipTap toolbar | 1 day |
| `comment-input.tsx` | 680 | Comment input with TipTap | 1 day |

**Total: ~6.5 days (~1 week)**

---

## 📋 Detailed Breakdown by Category

### Board & Kanban (5 files)
- `board.tsx` (280 lines) - 🟡 Medium
- `board-column.tsx` (560 lines) - 🟠 High - DnD logic
- `board-section.tsx` (800 lines) - 🟠 High - DnD + sections
- `list-view.tsx` (1600 lines) - 🟠 High - Alternative view + DnD
- `task-card.tsx` (700 lines) - 🟠 High - Draggable card

**Est. Time: 30 hrs (1 week)**

### Add Task System (14 files)
- `kanban-add-task-modal.tsx` (300 lines) - 🟠 High
- `add-task-modal-action-bar.tsx` (150 lines) - 🟡 Medium
- `add-task-modal-content.tsx` (50 lines) - 🟢 Low
- `add-task-modal-context.tsx` (80 lines) - 🟢 Low
- `add-task-modal-footer.tsx` (70 lines) - 🟢 Low
- `add-task-modal-popovers.tsx` (70 lines) - 🟢 Low
- `kanban-date-popover.tsx` (180 lines) - 🟡 Medium
- `kanban-priority-popover.tsx` (60 lines) - 🟢 Low
- `kanban-inline-label-popup.tsx` (85 lines) - 🟡 Medium
- `kanban-inline-project-popup.tsx` (260 lines) - 🟡 Medium
- `kanban-inline-section-popup.tsx` (75 lines) - 🟡 Medium
- `kanban-project-popover.tsx` (330 lines) - 🟡 Medium
- `kanban-reminder-popover.tsx` (140 lines) - 🟡 Medium
- `use-add-task-submit.ts` (200 lines) - 🟠 High
- `use-add-task-title-handler.ts` (290 lines) - 🟠 High

**Est. Time: 30-35 hrs (1 week)**

### Task Detail (14 files)
- `task-detail-modal/index.tsx` (900 lines) - 🟠 High
- `task-detail-header.tsx` (180 lines) - 🟡 Medium
- `task-title-description.tsx` (110 lines) - 🟡 Medium
- `task-right-panel.tsx` (580 lines) - 🟠 High
- `task-context-menu.tsx` (90 lines) - 🟠 High
- `task-detail-context.tsx` (120 lines) - 🟢 Low
- `task-detail-utils.ts` (50 lines) - 🟢 Low
- `comments-section.tsx` (320 lines) - 🟠 High
- `subtasks-section.tsx` (900 lines) - 🟠 High - DnD
- `sortable-subtask-row.tsx` (400 lines) - 🟠 High - DnD
- `comment-input-sticky.tsx` (45 lines) - 🟠 High
- `use-comment-state.ts` (250 lines) - 🟠 High
- `use-subtask-state.ts` (520 lines) - 🟠 High

**Est. Time: 45-50 hrs (1.5 weeks)**

### Rich Text Editor (7 files) - **Highest Risk**
- `rich-input.tsx` (780 lines) - 🔴 Very High - TipTap
- `tiptap-description.tsx` (360 lines) - 🔴 Very High - TipTap
- `description-input.tsx` (720 lines) - 🔴 Very High - TipTap
- `format-toolbar.tsx` (380 lines) - 🔴 Very High - TipTap toolbar
- `comment-input.tsx` (680 lines) - 🔴 Very High - TipTap
- `markdown-content.tsx` (60 lines) - 🟠 High
- `markdown-title.tsx` (95 lines) - 🟠 High

**Est. Time: 6.5 days (1 week)**

### Dialogs (6 files)
- `add-project-dialog.tsx` (350 lines) - 🟡 Medium
- `create-team-dialog.tsx` (270 lines) - 🟡 Medium
- `move-project-dialog.tsx` (170 lines) - 🟡 Medium
- `email-tasks-dialog.tsx` (170 lines) - 🟡 Medium
- `save-template-dialog.tsx` (115 lines) - 🟡 Medium
- `comments-dialog.tsx` (480 lines) - 🟠 High

**Est. Time: 15-18 hrs (~0.5 week)**

### Popovers (4 files)
- `emoji-picker.tsx` (400 lines) - 🟢 Low
- `label-popover.tsx` (120 lines) - 🟡 Medium
- `move-to-popover.tsx` (115 lines) - 🟡 Medium
- `share-popover.tsx` (270 lines) - 🟡 Medium

**Est. Time: 8-10 hrs (~0.25 week)**

### Sidebar & Navigation (4 files)
- `sidebar-header.tsx` (349 lines) - 🟡 Medium
- `projects-menu-content.tsx` (~500 lines) - 🟡 Medium
- `page-corner-menu.tsx` (~150 lines) - 🟡 Medium
- `search-palette.tsx` (~400 lines) - 🟡 Medium

**Est. Time: 12-15 hrs (~0.5 week)**

### Misc (2 files)
- `circle-checkbox.tsx` (87 lines) - 🟢 Low
- `task-form.tsx` (~200 lines) - 🟡 Medium

**Est. Time: 4 hrs (~0.1 week)**

---

## 🎯 Migration Priority

### Phase 1 - Foundation (Week 1)
1. ✅ Theme system understanding
2. ✅ Cheat sheet creation
3. ✅ Component audit
4. Add dependencies (@tiptap, @dnd-kit)

### Phase 2 - Core UI (Week 2-3)
1. **Sidebar** - `sidebar-header.tsx`, `projects-menu-content.tsx`
2. **Simple dialogs** - All dialogs in `/dialogs`
3. **Simple popovers** - All popovers in `/popovers`

### Phase 3 - Task Creation (Week 4)
1. **Add Task Modal** - All files in `/add-task`
2. **Circle Checkbox** - `circle-checkbox.tsx`

### Phase 4 - Board & Cards (Week 5-6)
1. **Task Card** - `task-card.tsx`
2. **Board Column** - `board-column.tsx`
3. **Board Section** - `board-section.tsx`
4. **Board Container** - `board.tsx`

### Phase 5 - Rich Text (Week 7) - **HIGH RISK**
1. **TipTap Setup** - Add dependencies, setup base
2. **Rich Input** - `rich-input.tsx`
3. **TipTap Description** - `tiptap-description.tsx`
4. **Format Toolbar** - `format-toolbar.tsx`

### Phase 6 - Task Detail (Week 8-9)
1. **Task Detail Modal** - `task-detail-modal/index.tsx`
2. **Task Header** - `task-detail-header.tsx`
3. **Right Panel** - `task-right-panel.tsx`
4. **Comments** - All comment components
5. **Subtasks** - All subtask components

### Phase 7 - List View (Week 10)
1. **List View** - `list-view.tsx`

### Phase 8 - Polish (Week 11-12)
1. Search palette
2. Page corner menu
3. Misc utilities

---

## 🚨 Risk Assessment

### High Risk Areas

1. **TipTap Integration** (7 files, ~1 week)
   - New dependency for venturo-skeleton-react
   - Complex state management
   - Needs MUI styling wrapper

2. **DnD with @dnd-kit** (6 files, ~1 week)
   - New dependency
   - Complex logic in board/list views
   - Needs MUI integration

3. **Form Migration** (multiple files)
   - Formik → RHF conversion
   - Yup → Zod conversion
   - Validation logic rewrite

### Medium Risk Areas

1. **Sidebar** - Complex navigation state
2. **Task Detail** - Large component, many sub-features
3. **Comments/Subtasks** - State management complexity

### Low Risk Areas

1. **Simple dialogs** - Straightforward CRUD
2. **Simple popovers** - Pickers and menus
3. **Display components** - Presentational only

---

## 📦 New Dependencies Required

```bash
# Rich text editor (already in plan)
yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder tiptap-markdown

# Drag & drop (already in plan)
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/modifiers

# Potentially needed (check venturo-skeleton-react)
yarn add react-use # if not already present
```

---

## 🎯 Success Metrics

Migration is successful when:
- ✅ All 56 components migrated
- ✅ Zero Tailwind classes remaining
- ✅ All TipTap editors working
- ✅ All DnD functionality working
- ✅ Forms use RHF + Zod
- ✅ TypeScript strict mode passes
- ✅ ESLint passes with no errors
- ✅ All features working as in source

---

*Last updated: 2026-05-11*
*Total estimated time: 8-12 weeks for full migration*
