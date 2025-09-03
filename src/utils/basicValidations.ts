// Check if given string is empty
export function isEmpty(val: string) {
  if (val.trim() === '') return true;
  return false;
}

// Checks if phone number format is valid
export function isValidPhoneFormat(phoneNumber: string): boolean {
  if (!phoneNumber) {
    return false;
  }
  const cleanedNumber = phoneNumber.replace(/[\s-()]/g, '');
  if (cleanedNumber.length !== 10) {
    return false;
  }
  if (!cleanedNumber.startsWith('5')) {
    return false;
  }
  const digitsOnly = /^\d+$/;
  if (!digitsOnly.test(cleanedNumber)) {
    return false;
  }
  return true;
}

// Checks if email format is valid
export function isValidEmail(email: string): boolean {
  if (!email) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
