/**
 * Validation utilities and schemas
 * Add your validation functions and schemas here
 */

// Example validation function
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Add more validation functions as needed
