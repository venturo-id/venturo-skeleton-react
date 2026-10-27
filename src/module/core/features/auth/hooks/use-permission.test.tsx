import type { AuthContextValue } from '../types';

import { it, expect, describe } from 'vitest';
import { renderHook } from '@testing-library/react';

import { authContextValue } from 'src/test/auth-fixtures';

import { usePermission } from './use-permission';
import { AuthContext } from '../context/auth-context';

// ----------------------------------------------------------------------

function renderUsePermission(overrides: Partial<AuthContextValue>) {
  const value = authContextValue(overrides);
  return renderHook(() => usePermission(), {
    wrapper: ({ children }) => <AuthContext value={value}>{children}</AuthContext>,
  });
}

describe('usePermission', () => {
  it('allows only the permissions the user holds', () => {
    const { result } = renderUsePermission({ permissions: ['roles:read', 'users:read'] });

    expect(result.current.can('roles:read')).toBe(true);
    expect(result.current.can('roles:delete')).toBe(false);
  });

  it('canAll needs every permission, canAny needs at least one', () => {
    const { result } = renderUsePermission({ permissions: ['roles:read'] });

    expect(result.current.canAll(['roles:read', 'roles:update'])).toBe(false);
    expect(result.current.canAny(['roles:read', 'roles:update'])).toBe(true);
    expect(result.current.canAny(['roles:update', 'roles:delete'])).toBe(false);
  });

  it('treats an empty list as satisfied for canAll and unsatisfied for canAny', () => {
    const { result } = renderUsePermission({ permissions: ['roles:read'] });

    expect(result.current.canAll([])).toBe(true);
    expect(result.current.canAny([])).toBe(false);
  });

  it('lets a super admin through every check without explicit permissions', () => {
    const { result } = renderUsePermission({ permissions: [], isSuperAdmin: true });

    expect(result.current.can('roles:delete')).toBe(true);
    expect(result.current.canAll(['roles:delete', 'users:delete'])).toBe(true);
    expect(result.current.canAny(['roles:delete'])).toBe(true);
  });

  it('follows permission changes, e.g. after a company switch', () => {
    let value = authContextValue({ permissions: ['roles:read'] });
    const { result, rerender } = renderHook(() => usePermission(), {
      wrapper: ({ children }) => <AuthContext value={value}>{children}</AuthContext>,
    });
    expect(result.current.can('roles:read')).toBe(true);

    value = authContextValue({ permissions: ['users:read'] });
    rerender();

    expect(result.current.can('roles:read')).toBe(false);
    expect(result.current.can('users:read')).toBe(true);
  });
});
