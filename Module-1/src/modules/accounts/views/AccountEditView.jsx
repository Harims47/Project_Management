import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import AccountForm from '../components/AccountForm';
import accountsService from '../services/accountsService';
import { Loader, ErrorState } from '../../../components/feedback/FeedbackStates';
import { Modal } from '../../../components/ui/Modal';

export const AccountEditView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const methods = useForm();

  // Load existing account data
  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoading(true);
        const data = await accountsService.getAccount(id);
        if (data) {
          // Pre-populate fields
          methods.reset({
            name: data.name || '',
            client: data.client || data.name || '',
            code: data.code || '',
            status: data.status || 'Active',
            tier: data.tier || 'Growth Silver',
            description: data.description || '',
            lead: data.lead || '',
            manager: data.manager || '',
            deliveryManager: data.deliveryManager || '',
            region: data.region || 'Global',
            country: data.country || '',
            industry: data.industry || '',
            services: data.services || []
          });
        } else {
          setError(new Error('Client Account not found in system.'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, [id, methods]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Update account in service
      await accountsService.updateAccount(id, data);
      
      // Reset dirty state to avoid warning
      methods.reset(data);
      navigate(`/accounts/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update client account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (methods.formState.isDirty) {
      setShowConfirmModal(true);
    } else {
      navigate(`/accounts/${id}`);
    }
  };

  if (loading) {
    return <Loader message="Fetching client account profiles..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => navigate('/accounts')} />;
  }

  const breadcrumbs = [
    { label: 'Accounts', path: '/accounts' },
    { label: methods.getValues('name') || 'Account Detail', path: `/accounts/${id}` },
    { label: 'Edit Profile' }
  ];

  return (
    <div className="page-container text-left">
      <PageHeader 
        title={`Edit Account: ${methods.getValues('name')}`} 
        subtitle="Modify core client variables and update operational ownership profiles."
        breadcrumbs={breadcrumbs}
      />

      <AccountForm 
        methods={methods} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
        isEdit={true}
        onCancel={handleCancel}
      />

      {/* Confirmation Modal for Unsaved Changes */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Unsaved Changes Detected"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-outline"
            >
              No, Keep Editing
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                navigate(`/accounts/${id}`);
              }}
              className="btn btn-primary"
            >
              Yes, Discard Changes
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You have modified some variables on this client account. Leaving this page will discard all unsaved edits. Are you sure you want to discard your changes?
        </p>
      </Modal>
    </div>
  );
};

export default AccountEditView;
