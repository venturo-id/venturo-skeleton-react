// Labels data hooks with caching

import type { Label, LabelFormData } from 'src/module/timebox/types';

import { useState, useEffect, useCallback } from 'react';

import { toast } from 'src/shared/ui/snackbar';
import { TIMEBOX_STORAGE_KEYS } from 'src/module/timebox/utils/constants';
import {
  getCached,
  setCached,
  CACHE_DURATION,
  invalidateLabelsCache,
} from 'src/module/timebox/utils/cache.helpers';

import * as labelsApi from '../api';

// ----------------------------------------------------------------------
// Hook: useLabels
// ----------------------------------------------------------------------

/**
 * Fetch all labels with caching
 */
export function useLabels(options?: { skipCache?: boolean }) {
  const [data, setData] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { skipCache = false } = options || {};

  const fetchLabels = useCallback(async (forceRefetch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      if (!skipCache && !forceRefetch) {
        const cached = getCached<Label[]>(TIMEBOX_STORAGE_KEYS.LABELS_CACHE, {
          duration: CACHE_DURATION.MEDIUM,
        });
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const labels = await labelsApi.getLabels();

      // Update cache
      setCached(TIMEBOX_STORAGE_KEYS.LABELS_CACHE, labels);

      setData(labels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch labels'));
      toast.error(err instanceof Error ? err.message : 'Failed to fetch labels');
    } finally {
      setIsLoading(false);
    }
  }, [skipCache]);

  // Initial fetch
  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  // Mutations
  const createLabel = useCallback(
    async (formData: LabelFormData) => {
      try {
        const newLabel = await labelsApi.createLabel(formData);

        // Update local state
        setData((prev) => [...prev, newLabel]);

        // Invalidate cache
        invalidateLabelsCache();

        toast.success('Label created successfully');
        return newLabel;
      } catch (err) {
        const labelError = err instanceof Error ? err : new Error('Failed to create label');
        toast.error(labelError.message);
        throw labelError;
      }
    },
    []
  );

  const updateLabel = useCallback(
    async (id: string, formData: Partial<LabelFormData>) => {
      try {
        const updatedLabel = await labelsApi.updateLabel(id, formData);

        // Update local state
        setData((prev) => prev.map((l) => (l.id === id ? updatedLabel : l)));

        // Invalidate cache
        invalidateLabelsCache();

        toast.success('Label updated successfully');
        return updatedLabel;
      } catch (err) {
        const labelError = err instanceof Error ? err : new Error('Failed to update label');
        toast.error(labelError.message);
        throw labelError;
      }
    },
    []
  );

  const deleteLabel = useCallback(
    async (id: string) => {
      try {
        await labelsApi.deleteLabel(id);

        // Update local state
        setData((prev) => prev.filter((l) => l.id !== id));

        // Invalidate cache
        invalidateLabelsCache();

        toast.success('Label deleted successfully');
      } catch (err) {
        const labelError = err instanceof Error ? err : new Error('Failed to delete label');
        toast.error(labelError.message);
        throw labelError;
      }
    },
    []
  );

  const refetch = useCallback(() => {
    fetchLabels(true);
  }, [fetchLabels]);

  return {
    data,
    isLoading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    refetch,
  };
}
