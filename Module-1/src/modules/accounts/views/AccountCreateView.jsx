import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import AccountForm from '../components/AccountForm';
import accountsService from '../services/accountsService';
import { ACCOUNT_DEFAULT_VALUES } from '../schemas/account.schema';

export const AccountCreateView = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const methods = useForm({
    defaultValues: ACCOUNT_DEFAULT_VALUES,
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Calculate dynamic satisfaction default score for mock database display compatibility
      const accountData = {
        ...data,
        satisf: parseFloat((3.5 + Math.random() * 1.5).toFixed(1))
      };

      await accountsService.createAccount(accountData);
      navigate('/accounts');
    } catch (err) {
      setError(err.message || 'Failed to create client account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Accounts', path: '/accounts' },
    { label: 'Create Account' }
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Create Client Account" 
        subtitle="Provision a new enterprise client profile in the directory system."
        breadcrumbs={breadcrumbs}
      />

      {error && (
        <div className="login-error-alert mb-6">
          <span>⚠️</span> {error}
        </div>
      )}

      <AccountForm 
        methods={methods} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default AccountCreateView;
