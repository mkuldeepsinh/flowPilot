interface ValidationResult {
  isValid: boolean;
  errors: {
    [key: string]: string;
  };
}

interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  companyName?: string;
  companyId?: string;
  role?: string;
}

export function validateSignupData(data: SignupData, isNewCompany: boolean): ValidationResult {
  const errors: { [key: string]: string } = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Confirm password validation
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (isNewCompany) {
    // New company validation
    if (!data.companyName) {
      errors.companyName = 'Company name is required';
    } else if (data.companyName.length < 2) {
      errors.companyName = 'Company name must be at least 2 characters long';
    }
  } else {
    // Existing company validation
    if (!data.companyId) {
      errors.companyId = 'Company ID is required';
    }

    if (!data.role) {
      errors.role = 'Role is required';
    } else if (!['admin', 'employee'].includes(data.role)) {
      errors.role = 'Invalid role selected';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateLoginData(data: { email: string; password: string }): ValidationResult {
  const errors: { [key: string]: string } = {};

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password || !data.password.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
} 