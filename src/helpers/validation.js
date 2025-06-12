export const validateSignupData = (data, isNewCompany) => {
    const errors = {};
  
    // Common validations
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      errors.email = 'Please enter a valid email';
    }
  
    if (!data.password || data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
  
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    if (isNewCompany) {
      if (!data.companyName || !data.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
    } else {
      if (!data.companyId || !data.companyId.trim()) {
        errors.companyId = 'Company ID is required';
      }
      
      if (!data.role || !['admin', 'employee'].includes(data.role)) {
        errors.role = 'Please select a valid role';
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const validateLoginData = (data) => {
    const errors = {};
  
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      errors.email = 'Please enter a valid email';
    }
  
    if (!data.password || !data.password.trim()) {
      errors.password = 'Password is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };