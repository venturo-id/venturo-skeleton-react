import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

type Props = {
  pending: boolean;
  /** The field's own end adornment (e.g. `%`), kept after the spinner. */
  children?: React.ReactNode;
  /** Leaves room for the dropdown arrow of a `select` field. */
  select?: boolean;
};

/**
 * `endAdornment` of a field that saves itself (on blur / on change): a spinner while
 * the save runs. Pair it with `disabled={pending}` so the value isn't edited mid-save.
 */
export function SavingAdornment({ pending, children, select }: Props) {
  if (!pending && !children) return null;

  return (
    <InputAdornment position="end" sx={select ? { mr: 2.5 } : undefined}>
      {pending && <CircularProgress size={16} color="inherit" sx={{ mr: children ? 1 : 0 }} />}
      {children}
    </InputAdornment>
  );
}
