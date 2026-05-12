// SearchPalette - Global search dialog for tasks, projects, and labels

import type { SearchResult, SearchFilters } from 'src/module/timebox/types';

import { useMemo, useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { CustomPopover } from 'src/shared/ui/custom-popover';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface SearchPaletteProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => Promise<SearchResult[]>;
  onNavigate?: (result: SearchResult) => void;
}

// ----------------------------------------------------------------------
// Tab Panel Component
// ----------------------------------------------------------------------

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function SearchPalette({
  open,
  anchorEl,
  onClose,
  onSearch,
  onNavigate,
}: SearchPaletteProps) {
  const { t: tCommon } = useTranslate('common');

  const [query, setQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [includeCompleted, setIncludeCompleted] = useState(false);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Clear when closed
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setSelectedProjectIds([]);
      setSelectedLabelIds([]);
      setIncludeCompleted(false);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const searchResults = await onSearch({
            query,
            projectIds: selectedProjectIds,
            labelIds: selectedLabelIds,
            includeCompleted,
          });
          setResults(searchResults);
        } catch (err) {
          console.error('Search failed:', err);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedProjectIds, selectedLabelIds, includeCompleted, onSearch]);

  // Group results by type
  const groupedResults = useMemo(() => ({
    task: results.filter((r) => r.type === 'task'),
    project: results.filter((r) => r.type === 'project'),
    label: results.filter((r) => r.type === 'label'),
  }), [results]);

  const totalResults = results.length;

  const handleResultClick = (result: SearchResult) => {
    onNavigate?.(result);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedProjectIds([]);
    setSelectedLabelIds([]);
    setIncludeCompleted(false);
  };

  const hasActiveFilters = selectedProjectIds.length > 0 || selectedLabelIds.length > 0 || includeCompleted;

  return (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: '100%',
            maxWidth: 600,
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Stack spacing={2}>
          {/* Search Input */}
          <TextField
            autoFocus
            placeholder={tCommon('search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:clock-circle-outline" width={20} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery('')} edge="end">
                    <Iconify icon="solar:close-circle-bold" width={16} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: 'action.hover',
                borderRadius: 1,
              },
            }}
          />

          {/* Filters */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Filters:
              </Typography>

              {/* Include completed */}
              <Chip
                label="Completed"
                size="small"
                onClick={() => setIncludeCompleted(!includeCompleted)}
                sx={{
                  height: 24,
                  bgcolor: includeCompleted ? 'primary.main' : 'action.hover',
                  color: includeCompleted ? '#fff' : 'text.secondary',
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />

              {/* Clear filters button */}
              {hasActiveFilters && (
                <Box sx={{ flex: 1 }} />
                )}

              {hasActiveFilters && (
                <Typography
                  variant="button"
                  onClick={handleClearFilters}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'primary.main',
                    cursor: 'pointer',
                  }}
                >
                  Clear filters
                </Typography>
              )}
            </Stack>

            {/* Selected filters display */}
            {hasActiveFilters && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {selectedProjectIds.map((id) => (
                <Chip
                  key={id}
                  label={`Project: ${id}`}
                  size="small"
                  onDelete={() => setSelectedProjectIds((prev) => prev.filter((i) => i !== id))}
                  sx={{
                    height: 20,
                    fontSize: 11,
                  }}
                />
              ))}
              {selectedLabelIds.map((id) => (
                <Chip
                  key={id}
                  label={`Label: ${id}`}
                  size="small"
                  onDelete={() => setSelectedLabelIds((prev) => prev.filter((i) => i !== id))}
                  sx={{
                    height: 20,
                    fontSize: 11,
                  }}
                />
              ))}
            </Stack>
            )}
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Results */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        {query.length < 2 ? (
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
            <Typography variant="body2">Type at least 2 characters to search</Typography>
            <Box sx={{ mt: 1, opacity: 0.5 }}>
              <Iconify icon="solar:clock-circle-bold" width={24} />
            </Box>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Press Cmd+K to open search
            </Typography>
          </Box>
        ) : isSearching ? (
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
            <Typography variant="body2">Searching...</Typography>
          </Box>
        ) : totalResults === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
            <Typography variant="body2">No results found</Typography>
          </Box>
        ) : (
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {Object.entries(groupedResults).map(([type, items], index) => (
              <Tab
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                value={index}
                disabled={items.length === 0}
                sx={{ textTransform: 'capitalize', minWidth: 80 }}
              />
            ))}
          </Tabs>
        )}

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {groupedResults.task.map((result) => (
            <ResultItem key={result.id} result={result} onClick={handleResultClick} />
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {groupedResults.project.map((result) => (
            <ResultItem key={result.id} result={result} onClick={handleResultClick} />
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {groupedResults.label.map((result) => (
            <ResultItem key={result.id} result={result} onClick={handleResultClick} />
          ))}
        </TabPanel>
      </Box>

      {/* Footer */}
      {totalResults > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </Typography>
        </Box>
      )}
    </CustomPopover>
  );
}

// ----------------------------------------------------------------------
// Result Item Component
// ----------------------------------------------------------------------

interface ResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

function ResultItem({ result, onClick }: ResultItemProps) {
  return (
    <Box
      onClick={() => onClick(result)}
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        transition: 'all 150ms',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {/* Type Icon */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify
          icon={
            result.type === 'task'
              ? 'solar:file-check-bold-duotone'
              : result.type === 'project'
                ? 'solar:add-folder-bold'
                : 'solar:tag-horizontal-bold-duotone'
          }
          width={18}
          sx={{ color: 'text.secondary' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {result.highlight?.title ? (
            <span dangerouslySetInnerHTML={{ __html: result.highlight.title }} />
          ) : (
            result.title
          )}
        </Typography>
        {result.projectName && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            in {result.projectName}
          </Typography>
        )}
      </Box>

      {/* Arrow */}
      <Iconify icon="solar:double-alt-arrow-right-bold-duotone" width={16} sx={{ color: 'text.disabled' }} />
    </Box>
  );
}
