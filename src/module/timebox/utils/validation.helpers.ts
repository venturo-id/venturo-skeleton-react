// Validation utilities for Timebox module

import { VALIDATION_RULES } from './constants';

// ----------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ----------------------------------------------------------------------
// Validation Functions
// ----------------------------------------------------------------------

/**
 * Validate project name
 */
export function validateProjectName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Project name is required' });
  } else if (name.length < VALIDATION_RULES.PROJECT_NAME_MIN) {
    errors.push({
      field: 'name',
      message: `Project name must be at least ${VALIDATION_RULES.PROJECT_NAME_MIN} character`,
    });
  } else if (name.length > VALIDATION_RULES.PROJECT_NAME_MAX) {
    errors.push({
      field: 'name',
      message: `Project name must not exceed ${VALIDATION_RULES.PROJECT_NAME_MAX} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate task title
 */
export function validateTaskTitle(title: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!title || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Task title is required' });
  } else if (title.length < VALIDATION_RULES.TASK_TITLE_MIN) {
    errors.push({
      field: 'title',
      message: `Task title must be at least ${VALIDATION_RULES.TASK_TITLE_MIN} character`,
    });
  } else if (title.length > VALIDATION_RULES.TASK_TITLE_MAX) {
    errors.push({
      field: 'title',
      message: `Task title must not exceed ${VALIDATION_RULES.TASK_TITLE_MAX} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate label name
 */
export function validateLabelName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Label name is required' });
  } else if (name.length < VALIDATION_RULES.LABEL_NAME_MIN) {
    errors.push({
      field: 'name',
      message: `Label name must be at least ${VALIDATION_RULES.LABEL_NAME_MIN} character`,
    });
  } else if (name.length > VALIDATION_RULES.LABEL_NAME_MAX) {
    errors.push({
      field: 'name',
      message: `Label name must not exceed ${VALIDATION_RULES.LABEL_NAME_MAX} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate team name
 */
export function validateTeamName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Team name is required' });
  } else if (name.length < VALIDATION_RULES.TEAM_NAME_MIN) {
    errors.push({
      field: 'name',
      message: `Team name must be at least ${VALIDATION_RULES.TEAM_NAME_MIN} character`,
    });
  } else if (name.length > VALIDATION_RULES.TEAM_NAME_MAX) {
    errors.push({
      field: 'name',
      message: `Team name must not exceed ${VALIDATION_RULES.TEAM_NAME_MAX} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate section name
 */
export function validateSectionName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Section name is required' });
  } else if (name.length < VALIDATION_RULES.SECTION_NAME_MIN) {
    errors.push({
      field: 'name',
      message: `Section name must be at least ${VALIDATION_RULES.SECTION_NAME_MIN} character`,
    });
  } else if (name.length > VALIDATION_RULES.SECTION_NAME_MAX) {
    errors.push({
      field: 'name',
      message: `Section name must not exceed ${VALIDATION_RULES.SECTION_NAME_MAX} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate color (hex format)
 */
export function validateColor(color: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!color || color.trim().length === 0) {
    errors.push({ field: 'color', message: 'Color is required' });
  } else if (!/^#[0-9A-F]{6}$/i.test(color)) {
    errors.push({ field: 'color', message: 'Color must be a valid hex color (e.g., #FF5630)' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid email address' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate date (ISO format)
 */
export function validateDate(date: string, allowEmpty = true): ValidationResult {
  const errors: ValidationError[] = [];

  if (!date || date.trim().length === 0) {
    if (!allowEmpty) {
      errors.push({ field: 'date', message: 'Date is required' });
    }
  } else {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push({ field: 'date', message: 'Date must be a valid date' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL
 */
export function validateUrl(url: string, allowEmpty = true): ValidationResult {
  const errors: ValidationError[] = [];

  if (!url || url.trim().length === 0) {
    if (!allowEmpty) {
      errors.push({ field: 'url', message: 'URL is required' });
    }
  } else {
    try {
      new URL(url);
    } catch {
      errors.push({ field: 'url', message: 'URL must be a valid URL' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------

/**
 * Get first error message from validation result
 */
export function getFirstErrorMessage(result: ValidationResult): string | null {
  if (result.errors.length === 0) return null;
  return result.errors[0].message;
}

/**
 * Get error messages as a single string
 */
export function getErrorMessages(result: ValidationResult, separator = ', '): string {
  return result.errors.map((error) => error.message).join(separator);
}

/**
 * Check if field has error
 */
export function fieldHasError(result: ValidationResult, field: string): boolean {
  return result.errors.some((error) => error.field === field);
}

/**
 * Get error message for specific field
 */
export function getFieldError(result: ValidationResult, field: string): string | null {
  const error = result.errors.find((e) => e.field === field);
  return error?.message ?? null;
}
