import { useRef, useState, useCallback } from 'react';

// ----------------------------------------------------------------------
// Tracks one async action (save, delete, toggle…) for the button or field that
// starts it. `pending` drives that control's `loading` / `disabled` prop, so the
// user sees the request running instead of a button that looks stuck.
//
// A `run` while one is still pending is ignored — a double-click doesn't send
// the request twice. Errors are left to the action (toast inside it); `run`
// rejects with them like the action would.
//
//   const saving = useAsyncAction();
//   <Button loading={saving.pending} onClick={() => saving.run(() => onSave(value))}>

export function useAsyncAction() {
  const [pending, setPending] = useState(false);
  const running = useRef(false);

  const run = useCallback(async (action: () => unknown) => {
    if (running.current) return;
    running.current = true;
    setPending(true);
    try {
      await action();
    } finally {
      running.current = false;
      setPending(false);
    }
  }, []);

  return { pending, run };
}
