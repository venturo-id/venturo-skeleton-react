// CircleCheckbox - Todoist-style circular checkbox for tasks


import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';


// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface CircleCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
}

// ----------------------------------------------------------------------
// Helper: Get priority color
// ----------------------------------------------------------------------

function getPriorityColor(priority: CircleCheckboxProps['priority']) {
  switch (priority) {
    case 'urgent':
    case 'high':
      return '#FA383E'; // error.main
    case 'medium':
      return '#FFAB00'; // warning.main
    case 'low':
      return '#00B8D9'; // info.main
    case 'none':
    default:
      return '#919EAB'; // text.disabled
  }
}

// ----------------------------------------------------------------------
// Icons
// ----------------------------------------------------------------------

function CheckIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ width: 14, height: 14 }}>
      <path
        fill="currentColor"
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      />
    </SvgIcon>
  );
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function CircleCheckbox({
  checked,
  onChange,
  disabled = false,
  size = 'small',
  priority,
}: CircleCheckboxProps) {
  const priorityColor = getPriorityColor(priority);

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const iconSize = size === 'small' ? 20 : 24;

  return (
    <IconButton
      onClick={handleClick}
      disabled={disabled}
      sx={{
        p: 0.5,
        width: iconSize + 8,
        height: iconSize + 8,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
    >
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: checked ? 'primary.main' : priorityColor,
          bgcolor: checked ? 'primary.main' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms',
          ...(checked && {
            borderColor: 'primary.main',
          }),
        }}
      >
        {checked && <CheckIcon />}
      </Box>
    </IconButton>
  );
}
