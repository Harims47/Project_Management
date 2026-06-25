import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export const ProjectForm = ({
  isOpen,
  onClose,
  onSubmit,
  project = null, // If set, we are editing
  clientsList = [],
  servicesList = [
    { value: 'Creative', label: 'Creative Capabilities' },
    { value: 'Digital', label: 'Digital Web Solutions' },
    { value: 'Research', label: 'Clinical & Scientific Research' },
    { value: 'Video', label: 'Rich Media & Video Productions' }
  ]
}) => {
  const isEdit = !!project;

  const defaultFormState = {
    projectCode: '',
    projectName: '',
    clientId: '',
    manager: '',
    service: 'Creative',
    revenue: '',
    startDate: '',
    endDate: '',
    status: 'Ongoing',
    remarks: ''
  };

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setForm({
        projectCode: project.projectCode || '',
        projectName: project.projectName || '',
        clientId: project.clientId || '',
        manager: project.manager || '',
        service: project.service || 'Creative',
        revenue: project.revenue || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        status: project.status || 'Ongoing',
        remarks: project.remarks || ''
      });
      setErrors({});
    } else {
      setForm(defaultFormState);
      setErrors({});
    }
  }, [project, isOpen]);

  const handleChange = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: val
    }));
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.projectCode.trim()) tempErrors.projectCode = 'Project Code is required';
    if (!form.projectName.trim()) tempErrors.projectName = 'Project Name is required';
    if (!form.clientId) tempErrors.clientId = 'Client Account is required';
    if (!form.manager.trim()) tempErrors.manager = 'Manager name is required';
    if (!form.revenue || Number(form.revenue) <= 0) tempErrors.revenue = 'Revenue must be a positive number';
    if (!form.startDate) tempErrors.startDate = 'Start Date is required';
    if (!form.endDate) tempErrors.endDate = 'End Date is required';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      tempErrors.endDate = 'End Date must be after Start Date';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Map client name from clients list
    const clientObj = clientsList.find(c => c.id === form.clientId);
    const clientName = clientObj ? clientObj.name : 'Unknown Client';

    onSubmit({
      id: project ? project.id : `proj-${Date.now()}`,
      ...form,
      revenue: Number(form.revenue),
      clientName
    });
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Project: ${project.projectCode}` : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Project Code */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Project Code <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="text"
              value={form.projectCode}
              onChange={(e) => handleChange('projectCode', e.target.value)}
              placeholder="e.g. CR-1051"
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.projectCode ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.projectCode && <span className="text-xs text-accent font-semibold">{errors.projectCode}</span>}
          </div>

          {/* Project Name */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Project Name <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="e.g. Pfizer Portal Redesign"
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.projectName ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.projectName && <span className="text-xs text-accent font-semibold">{errors.projectName}</span>}
          </div>

          {/* Client Account */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Client Account <span className="text-accent ml-1">*</span>
            </label>
            <select
              value={form.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.clientId ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <option value="" disabled>Select Client Account</option>
              {clientsList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.clientId && <span className="text-xs text-accent font-semibold">{errors.clientId}</span>}
          </div>

          {/* Project Manager */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Project Manager <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="text"
              value={form.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
              placeholder="e.g. Alex Mercer"
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.manager ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.manager && <span className="text-xs text-accent font-semibold">{errors.manager}</span>}
          </div>

          {/* Service Line */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Capability Line <span className="text-accent ml-1">*</span>
            </label>
            <select
              value={form.service}
              onChange={(e) => handleChange('service', e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 outline-none text-sm cursor-pointer"
            >
              {servicesList.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Project Status <span className="text-accent ml-1">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 outline-none text-sm cursor-pointer"
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Pipeline">Pipeline</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Revenue */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Project Revenue ($) <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="number"
              value={form.revenue}
              onChange={(e) => handleChange('revenue', e.target.value)}
              placeholder="e.g. 50000"
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.revenue ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.revenue && <span className="text-xs text-accent font-semibold">{errors.revenue}</span>}
          </div>

          {/* Empty spacer for alignment */}
          <div></div>

          {/* Start Date */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Start Date <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.startDate ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.startDate && <span className="text-xs text-accent font-semibold">{errors.startDate}</span>}
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              End Date <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={`w-full py-2 px-3 rounded-lg border text-sm transition-all outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                errors.endDate ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
              }`}
            />
            {errors.endDate && <span className="text-xs text-accent font-semibold">{errors.endDate}</span>}
          </div>

        </div>

        {/* Remarks */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Project Remarks
          </label>
          <textarea
            value={form.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Provide comments or status updates for this project..."
            rows={3}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-sm outline-none resize-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 focus:border-primary"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 dark:border-gray-850 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
          >
            {isEdit ? 'Save Changes' : 'Add Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;
