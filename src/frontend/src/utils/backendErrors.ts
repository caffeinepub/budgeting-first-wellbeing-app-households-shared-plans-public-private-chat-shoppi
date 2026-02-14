/**
 * Translates backend error messages into user-friendly English messages
 */
export function translateBackendError(error: any): string {
  const errorMessage = error?.message || String(error);

  // Authorization errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('permission')) {
    if (errorMessage.includes('staff') || errorMessage.includes('admin')) {
      return 'You do not have permission to perform this action. Staff access required.';
    }
    return 'You do not have permission to perform this action.';
  }

  // Not found errors
  if (errorMessage.includes('not found') || errorMessage.includes('Not found')) {
    return 'The requested item could not be found.';
  }

  // Validation errors
  if (errorMessage.includes('already exists') || errorMessage.includes('already taken')) {
    return 'This item already exists. Please try a different value.';
  }

  if (errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
    return 'The provided information is invalid. Please check and try again.';
  }

  // Age restriction
  if (errorMessage.includes('18') || errorMessage.includes('age')) {
    return 'You must be 18 years or older to use this feature.';
  }

  // Household errors
  if (errorMessage.includes('household')) {
    return 'There was an issue with your household. Please check your membership status.';
  }

  // Blocking/pause errors
  if (errorMessage.includes('blocked') || errorMessage.includes('paused')) {
    return 'This conversation is currently unavailable.';
  }

  // Generic trap/runtime errors
  if (errorMessage.includes('trap') || errorMessage.includes('canister')) {
    return 'A temporary issue occurred. Please try again in a moment.';
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
}
