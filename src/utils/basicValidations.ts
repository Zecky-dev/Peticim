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

// Check if given values are the same - deep equality
export const isEqual = (value: any, other: any) => {
  if (typeof value !== "object" && typeof other !== "object") {
    return Object.is(value, other);
  }

  if (value === null && other === null) {
    return true;
  }

  if (typeof value !== typeof other) {
    return false;
  }

  if (value === other) {
    return true;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(value) || Array.isArray(other)) {
    return false;
  }

  if (Object.keys(value).length !== Object.keys(other).length) {
    return false;
  }

  for (const [k, v] of Object.entries(value)) {
    if (!(k in other)) {
      return false;
    }

    if (!isEqual(v, other[k])) {
      return false;
    }
  }

  return true;
}
