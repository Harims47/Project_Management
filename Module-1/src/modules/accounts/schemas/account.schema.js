export const ACCOUNT_VALIDATION_RULES = {
  name: {
    required: 'Account Name is required',
    minLength: { value: 3, message: 'Account Name must be at least 3 characters' }
  },
  client: {
    required: 'Client Name is required',
    minLength: { value: 3, message: 'Client Name must be at least 3 characters' }
  },
  code: {
    pattern: {
      value: /^[A-Z0-9-]+$/i,
      message: 'Account Code must contain only alphanumeric characters or hyphens'
    }
  },
  status: {
    required: 'Account Status is required'
  },
  tier: {
    required: 'Tier Classification is required'
  }
};

export const ACCOUNT_DEFAULT_VALUES = {
  name: '',
  client: '',
  code: '',
  status: 'Pending',
  tier: 'Growth Silver',
  description: '',
  lead: '',
  manager: '',
  deliveryManager: '',
  region: 'Global',
  country: '',
  industry: '',
  services: []
};

export default {
  ACCOUNT_VALIDATION_RULES,
  ACCOUNT_DEFAULT_VALUES
};
