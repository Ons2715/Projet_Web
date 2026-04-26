/**
 * Input validation schemas
 * Define validation rules for API requests
 */

export const validationRules = {
  auth: {
    register: {
      nom: { required: true, minLength: 3, maxLength: 100 },
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
      telephone: { required: true, pattern: /^[0-9]{8}$/ },
      adresse: { required: false, maxLength: 255 },
      role: { required: true, enum: ["eleve", "moniteur"] }
    },
    login: {
      email: { required: true, email: true },
      password: { required: true }
    }
  },
  user: {
    update: {
      nom: { required: false, minLength: 3, maxLength: 100 },
      email: { required: false, email: true },
      telephone: { required: false, pattern: /^[0-9]{8}$/ },
      adresse: { required: false, maxLength: 255 }
    }
  },
  booking: {
    create: {
      seance_id: { required: true, type: "number" },
      moniteur_id: { required: true, type: "number" },
      date_reservation: { required: true, type: "date" }
    },
    update: {
      statut: { required: false, enum: ["confirmee", "annulee", "completee"] }
    }
  },
  payment: {
    create: {
      eleve_id: { required: true, type: "number" },
      montant: { required: true, type: "number", min: 0 },
      methode: { required: true, enum: ["carte", "virement", "especes"] }
    }
  },
  lesson: {
    create: {
      titre: { required: true, minLength: 3, maxLength: 200 },
      contenu: { required: true, minLength: 10 },
      theme: { required: false, maxLength: 100 }
    }
  }
};

/**
 * Validate input against rules
 * @param {Object} data - Data to validate
 * @param {string} type - Validation rule type (e.g., "auth.register")
 * @returns {Object} - { valid: boolean, errors: {} }
 */
export function validateInput(data, type) {
  const rules = validationRules[type.split(".")[0]]?.[type.split(".")[1]];
  
  if (!rules) {
    return { valid: true, errors: {} };
  }

  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Check required
    if (rule.required && (!value || String(value).trim() === "")) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (!value) continue;

    // Check type
    if (rule.type) {
      const actualType = Array.isArray(value) ? "array" : typeof value;
      if (actualType !== rule.type && rule.type !== "number") {
        errors[field] = `${field} must be ${rule.type}`;
      }
    }

    // Check email
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = `${field} must be a valid email`;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors[field] = `${field} format is invalid`;
    }

    // Check enum
    if (rule.enum && !rule.enum.includes(value)) {
      errors[field] = `${field} must be one of: ${rule.enum.join(", ")}`;
    }

    // Check length
    if (rule.minLength && String(value).length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && String(value).length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }

    // Check range
    if (rule.min !== undefined && Number(value) < rule.min) {
      errors[field] = `${field} must be at least ${rule.min}`;
    }

    if (rule.max !== undefined && Number(value) > rule.max) {
      errors[field] = `${field} must not exceed ${rule.max}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
