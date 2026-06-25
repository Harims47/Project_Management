import React from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input, TextArea, Select } from '../../../components/forms/FormControls';
import MultiSelect from '../../../components/forms/MultiSelect';
import { Card } from '../../../components/cards/DashboardCards';
import { Button } from '../../../components/ui/Button';
import { 
  ACCOUNT_STATUSES, 
  TIER_CLASSIFICATIONS, 
  REGIONS, 
  INDUSTRIES, 
  SERVICE_OPTIONS 
} from '../constants/account.constants';
import { ACCOUNT_VALIDATION_RULES } from '../schemas/account.schema';
import { Briefcase, MapPin, Shield, Users } from 'lucide-react';

export const AccountForm = ({ methods, onSubmit, isSubmitting, isEdit = false, onCancel }) => {
  const { register, control, formState: { errors } } = methods;
  const navigate = useNavigate();

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      {/* 1. Account Information */}
      <Card className="text-left flex flex-col gap-5 border-t-4 border-primary">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Account Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Account Name"
            required={true}
            error={errors.name?.message}
            {...register('name', ACCOUNT_VALIDATION_RULES.name)}
            placeholder="e.g. Pfizer Inc."
          />

          <Input
            label="Client Name"
            required={true}
            error={errors.client?.message}
            {...register('client', ACCOUNT_VALIDATION_RULES.client)}
            placeholder="e.g. Pfizer Global"
          />

          <Input
            label="Account Code"
            error={errors.code?.message}
            {...register('code', ACCOUNT_VALIDATION_RULES.code)}
            placeholder="e.g. PFIZ-2026"
          />

          <Select
            label="Account Status"
            required={true}
            options={ACCOUNT_STATUSES}
            error={errors.status?.message}
            {...register('status', ACCOUNT_VALIDATION_RULES.status)}
            placeholder="Select Status"
          />

          <Select
            label="Tier Classification"
            required={true}
            options={TIER_CLASSIFICATIONS}
            error={errors.tier?.message}
            {...register('tier', ACCOUNT_VALIDATION_RULES.tier)}
            placeholder="Select Tier"
          />
        </div>

        <TextArea
          label="Description"
          {...register('description')}
          placeholder="Brief description of the client portfolio account, partnership details, and operational focus..."
        />
      </Card>

      {/* 2. Ownership Information */}
      <Card className="text-left flex flex-col gap-5 border-t-4 border-secondary">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <Users className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ownership Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Global Lead"
            {...register('lead')}
            placeholder="e.g. Sarah Jenkins"
          />

          <Input
            label="Account Manager"
            {...register('manager')}
            placeholder="e.g. John Smith"
          />

          <Input
            label="Delivery Manager"
            {...register('deliveryManager')}
            placeholder="e.g. Richard Hendricks"
          />
        </div>
      </Card>

      {/* 3. Geography & Business Information */}
      <Card className="text-left flex flex-col gap-5 border-t-4 border-accent">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <MapPin className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Geography & Business Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Region"
            options={REGIONS}
            {...register('region')}
            placeholder="Select Region"
          />

          <Input
            label="Country"
            {...register('country')}
            placeholder="e.g. United States"
          />

          <Select
            label="Industry"
            options={INDUSTRIES}
            {...register('industry')}
            placeholder="Select Industry"
          />

          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <MultiSelect
                label="Services Offered"
                options={SERVICE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Choose service capabilities..."
              />
            )}
          />
        </div>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel || (() => navigate('/accounts'))}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
        >
          {isEdit ? 'Update Account' : 'Save'}
        </Button>
      </div>

    </form>
  );
};

export default AccountForm;
