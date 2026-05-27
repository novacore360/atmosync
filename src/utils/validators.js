export const validators = {
  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 8 chars, at least 1 letter and 1 number)
  isValidPassword(password) {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return password.length >= minLength && hasLetter && hasNumber;
  },

  // Get password strength
  getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const strengthMap = {
      0: { level: 'Very Weak', color: '#ef4444', percentage: 20 },
      1: { level: 'Weak', color: '#f97316', percentage: 40 },
      2: { level: 'Fair', color: '#f59e0b', percentage: 60 },
      3: { level: 'Good', color: '#84cc16', percentage: 80 },
      4: { level: 'Strong', color: '#10b981', percentage: 100 },
      5: { level: 'Very Strong', color: '#06b6d4', percentage: 100 },
    };
    
    return strengthMap[strength] || strengthMap[0];
  },

  // Location validation
  isValidCoordinates(lat, lon) {
    return (
      typeof lat === 'number' &&
      typeof lon === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  },

  // URL validation
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Goal validation
  isValidGoal(goal) {
    const errors = [];
    
    if (!goal.title || goal.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!goal.target || goal.target <= 0) {
      errors.push('Target must be greater than 0');
    }
    
    if (goal.current < 0) {
      errors.push('Current progress cannot be negative');
    }
    
    if (goal.current > goal.target) {
      errors.push('Current progress cannot exceed target');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Settings validation
  validateSettings(settings) {
    const errors = [];
    
    if (settings.refreshInterval && settings.refreshInterval < 1) {
      errors.push('Refresh interval must be at least 1 minute');
    }
    
    if (settings.refreshInterval && settings.refreshInterval > 60) {
      errors.push('Refresh interval cannot exceed 60 minutes');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Form field validators
  required(value, fieldName = 'This field') {
    return value && value.toString().trim().length > 0 
      ? null 
      : `${fieldName} is required`;
  },

  minLength(min, value, fieldName = 'This field') {
    return value && value.length >= min 
      ? null 
      : `${fieldName} must be at least ${min} characters`;
  },

  maxLength(max, value, fieldName = 'This field') {
    return value && value.length <= max 
      ? null 
      : `${fieldName} must not exceed ${max} characters`;
  },

  isNumber(value, fieldName = 'This field') {
    return !isNaN(value) && isFinite(value) 
      ? null 
      : `${fieldName} must be a number`;
  },

  min(min, value, fieldName = 'This field') {
    return value >= min 
      ? null 
      : `${fieldName} must be at least ${min}`;
  },

  max(max, value, fieldName = 'This field') {
    return value <= max 
      ? null 
      : `${fieldName} must not exceed ${max}`;
  },
};
