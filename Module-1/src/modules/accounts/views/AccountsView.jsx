import React, { useState, useMemo } from 'react';
import { Plus, Users, Briefcase, Activity, Calendar, Trophy, CheckCircle, Play, FileText, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, StatisticCard } from '../../../components/cards/DashboardCards';
import { Button } from '../../../components/ui/Button';
import { Modal, ConfirmationDialog } from '../../../components/ui/Modal';

// Reusable subcomponents
import AccountsTable from '../components/AccountsTable';
import AccountDrawer from '../components/AccountDrawer';
import ImportHistoryPanel from '../components/ImportHistoryPanel';

// Dummy JSON datasets
import initialAccounts from '../data/accounts';
import initialProjects from '../data/projects';

// Utility helper routines
import { filterProjects } from '../utils/helpers/filterUtils';
import { mapImportedRowsToSchema } from '../utils/helpers/importUtils';

const INITIAL_FILTERS = {
  search: '',
  multiSearch: '',
  service: '',
  status: '',
  manager: '',
  client: '',
  startDate: '',
  endDate: '',
  minRevenue: '',
  maxRevenue: ''
};

export const AccountsView = () => {
  // Master states
  const [accountsList, setAccountsList] = useState(initialAccounts);
  const [projectsList, setProjectsList] = useState(initialProjects);

  // Phase 2: Import logs and undo buffers
  const [importHistory, setImportHistory] = useState([]);
  const [lastImportedProjectIds, setLastImportedProjectIds] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  // Drawer states
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerFilters, setDrawerFilters] = useState(INITIAL_FILTERS);

  // CRUD modal states
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  // Account form local states (for Add/Edit Account modals)
  const [accountForm, setAccountForm] = useState({
    name: '',
    globalLead: '',
    region: 'Global',
    industry: 'Pharmaceuticals',
    country: '',
    website: '',
    status: 'Active',
    tier: 'Growth Silver',
    description: '',
    contactEmail: ''
  });
  const [accountFormErrors, setAccountFormErrors] = useState({});

  // -------------------------------------------------------------
  // Data Filtering Logic for Drawer
  // -------------------------------------------------------------
  const selectedAccountObj = useMemo(() => {
    return accountsList.find(acc => acc.id === selectedAccountId) || null;
  }, [accountsList, selectedAccountId]);

  const selectedAccountProjects = useMemo(() => {
    if (!selectedAccountId) return [];
    return projectsList.filter(p => p.clientId === selectedAccountId);
  }, [projectsList, selectedAccountId]);

  const filteredDrawerProjects = useMemo(() => {
    return filterProjects(projectsList, drawerFilters, selectedAccountId);
  }, [projectsList, drawerFilters, selectedAccountId]);

  // Project Excel Import Handler
  const handleImportProjects = (validRows, fileName, summary) => {
    // Map rows to schema objects
    const mapped = mapImportedRowsToSchema(validRows, selectedAccountId, selectedAccountObj, accountsList);
    
    // Add to project list state
    setProjectsList(prev => [...mapped, ...prev]);

    // Store IDs to allow undo action
    const ids = mapped.map(p => p.id);
    setLastImportedProjectIds(ids);

    // Add record to import history logger
    const newLog = {
      id: `log-${Date.now()}`,
      fileName,
      uploadedDate: new Date().toLocaleString(),
      totalRecords: summary.totalRecords,
      validRecords: summary.validRecords,
      invalidRecords: summary.invalidRecords,
      status: 'Success'
    };
    setImportHistory(prev => [newLog, ...prev]);

    // Render success banner
    setSuccessBanner({
      message: `Successfully imported ${validRows.length} project records from "${fileName}".`,
      undoable: true
    });
  };

  // Undo Import Handler
  const handleUndoImport = () => {
    if (lastImportedProjectIds && lastImportedProjectIds.length > 0) {
      setProjectsList(prev => prev.filter(p => !lastImportedProjectIds.includes(p.id)));
      
      // Update first history log status to Undone
      setImportHistory(prev => 
        prev.map((log, index) => index === 0 ? { ...log, status: 'Undone' } : log)
      );

      setLastImportedProjectIds(null);
      setSuccessBanner({
        message: 'Import operation rolled back. Projects removed from session state.',
        undoable: false
      });

      // Clear banner automatically after 3 seconds
      setTimeout(() => {
        setSuccessBanner(null);
      }, 3000);
    }
  };

  // -------------------------------------------------------------
  // Aggregated KPI stats calculations
  // -------------------------------------------------------------
  const kpis = useMemo(() => {
    const totalAccounts = accountsList.length;
    const totalProjects = projectsList.length;
    
    const creativeCount = projectsList.filter(p => p.service === 'Creative').length;
    const digitalCount = projectsList.filter(p => p.service === 'Digital').length;
    const researchCount = projectsList.filter(p => p.service === 'Research').length;
    const videoCount = projectsList.filter(p => p.service === 'Video').length;

    const completedCount = projectsList.filter(p => p.status === 'Completed').length;
    const ongoingCount = projectsList.filter(p => p.status === 'Ongoing').length;
    const pipelineCount = projectsList.filter(p => p.status === 'Pipeline').length;
    const cancelledCount = projectsList.filter(p => p.status === 'Cancelled').length;

    return {
      totalAccounts,
      totalProjects,
      creativeCount,
      digitalCount,
      researchCount,
      videoCount,
      completedCount,
      ongoingCount,
      pipelineCount,
      cancelledCount
    };
  }, [accountsList, projectsList]);

  // -------------------------------------------------------------
  // View Drawer Handlers
  // -------------------------------------------------------------
  const handleViewAccount = (account) => {
    setSelectedAccountId(account.id);
    setDrawerFilters(INITIAL_FILTERS); // reset active filter
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAccountId(null);
  };

  // -------------------------------------------------------------
  // Account Form Validation & Submit Handlers
  // -------------------------------------------------------------
  const openAddAccountModal = () => {
    setAccountForm({
      name: '',
      globalLead: '',
      region: 'Global',
      industry: 'Pharmaceuticals',
      country: '',
      website: '',
      status: 'Active',
      tier: 'Growth Silver',
      description: '',
      contactEmail: ''
    });
    setAccountFormErrors({});
    setIsCreateAccountOpen(true);
  };

  const openEditAccountModal = (account) => {
    setAccountForm({
      name: account.name || '',
      globalLead: account.globalLead || '',
      region: account.region || 'Global',
      industry: account.industry || 'Pharmaceuticals',
      country: account.country || '',
      website: account.website || '',
      status: account.status || 'Active',
      tier: account.tier || 'Growth Silver',
      description: account.description || '',
      contactEmail: account.contactEmail || ''
    });
    setAccountFormErrors({});
    setEditingAccount(account);
  };

  const validateAccountForm = () => {
    const errs = {};
    if (!accountForm.name.trim()) errs.name = 'Account Name is required';
    if (!accountForm.globalLead.trim()) errs.globalLead = 'Global Lead is required';
    if (!accountForm.country.trim()) errs.country = 'Country is required';
    if (!accountForm.website.trim()) errs.website = 'Website URL is required';
    if (!accountForm.contactEmail.trim()) errs.contactEmail = 'Contact email is required';

    setAccountFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!validateAccountForm()) return;

    if (editingAccount) {
      // Edit Account
      setAccountsList(prev => 
        prev.map(acc => acc.id === editingAccount.id 
          ? { ...acc, ...accountForm } 
          : acc
        )
      );
      setEditingAccount(null);
    } else {
      // Create Account
      const newId = accountForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newAccount = {
        id: newId,
        ...accountForm
      };
      setAccountsList(prev => [...prev, newAccount]);
      setIsCreateAccountOpen(false);
    }
  };

  // -------------------------------------------------------------
  // Account Delete Handlers
  // -------------------------------------------------------------
  const openDeleteAccountConfirm = (account) => {
    setDeletingAccount(account);
  };

  const handleDeleteAccountConfirm = () => {
    if (deletingAccount) {
      setAccountsList(prev => prev.filter(acc => acc.id !== deletingAccount.id));
      // Clean up linked projects
      setProjectsList(prev => prev.filter(p => p.clientId !== deletingAccount.id));
      setDeletingAccount(null);
    }
  };

  // -------------------------------------------------------------
  // Projects CRUD Handlers
  // -------------------------------------------------------------
  const handleAddProject = (newProj) => {
    setProjectsList(prev => [newProj, ...prev]);
  };

  const handleEditProject = (projCode, updatedProj) => {
    setProjectsList(prev => 
      prev.map(p => p.projectCode === projCode ? { ...p, ...updatedProj } : p)
    );
  };

  const handleOpenDeleteProjectConfirm = (project) => {
    setDeletingProject(project);
  };

  const handleDeleteProjectConfirm = () => {
    if (deletingProject) {
      setProjectsList(prev => prev.filter(p => p.projectCode !== deletingProject.projectCode));
      setDeletingProject(null);
    }
  };

  return (
    <div className="page-container text-left select-none">
      {/* 1. Header Row */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="text-left">
            <h1 className="page-title text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Client Accounts Portfolio
            </h1>
            <p className="page-subtitle text-sm text-gray-400 mt-1">
              Manage enterprise client directories, monitor capability tallies, review run-rates, and manage project items.
            </p>
          </div>
          <Button onClick={openAddAccountModal} icon={Plus}>
            Create Account
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-sm font-semibold flex items-center justify-between gap-4 animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span>{successBanner.message}</span>
          </div>
          {successBanner.undoable && (
            <button 
              onClick={handleUndoImport}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shadow-sm transition-colors"
            >
              Undo Import
            </button>
          )}
        </div>
      )}

      {/* 2. Aggregate KPI Cards Grid (10 cards split into two rows for responsiveness and clarity) */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Row A: Master Metrics & Statuses */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatisticCard 
            title="Total Accounts" 
            value={kpis.totalAccounts} 
            icon={Users} 
            accentColor="primary"
          />
          <StatisticCard 
            title="Total Projects" 
            value={kpis.totalProjects} 
            icon={Briefcase} 
            accentColor="secondary"
          />
          <StatisticCard 
            title="Completed" 
            value={kpis.completedCount} 
            icon={CheckCircle} 
            accentColor="green"
          />
          <StatisticCard 
            title="Ongoing" 
            value={kpis.ongoingCount} 
            icon={Play} 
          />
          <div className="col-span-2 md:col-span-1">
            <StatisticCard 
              title="Pipeline" 
              value={kpis.pipelineCount} 
              icon={FileText} 
              accentColor="accent"
            />
          </div>
        </div>

        {/* Row B: Service Capacities & Cancelled */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-indigo-500/5 border-l-4 border-indigo-500 text-left flex flex-col justify-center">
            <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">Creative Services</span>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{kpis.creativeCount} Projects</span>
          </Card>
          <Card className="p-4 bg-sky-500/5 border-l-4 border-sky-500 text-left flex flex-col justify-center">
            <span className="text-[10px] font-black text-sky-500 dark:text-sky-400 uppercase tracking-wide">Digital Services</span>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{kpis.digitalCount} Projects</span>
          </Card>
          <Card className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 text-left flex flex-col justify-center">
            <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-wide">Research Services</span>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{kpis.researchCount} Projects</span>
          </Card>
          <Card className="p-4 bg-rose-500/5 border-l-4 border-rose-500 text-left flex flex-col justify-center">
            <span className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-wide">Video Services</span>
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{kpis.videoCount} Projects</span>
          </Card>
          <div className="col-span-2 md:col-span-1">
            <Card className="p-4 bg-gray-500/5 border-l-4 border-gray-400 dark:border-gray-600 text-left flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cancelled/Void</span>
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{kpis.cancelledCount} Projects</span>
            </Card>
          </div>
        </div>
      </div>

      {/* Import History Logs Auditing Panel */}
      <ImportHistoryPanel history={importHistory} />

      {/* 3. Master Accounts Table */}
      <Card className="p-6">
        <h3 className="text-base font-black text-gray-900 dark:text-gray-150 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
          Enterprise Accounts Directory
        </h3>
        <AccountsTable 
          accounts={accountsList}
          projects={projectsList}
          onView={handleViewAccount}
          onEdit={openEditAccountModal}
          onDelete={openDeleteAccountConfirm}
        />
      </Card>

      {/* 4. Side View Detail Drawer Panel */}
      <AccountDrawer 
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        account={selectedAccountObj}
        projects={selectedAccountProjects}
        filteredProjects={filteredDrawerProjects}
        allProjects={projectsList}
        filters={drawerFilters}
        onFilterChange={setDrawerFilters}
        onResetFilters={() => setDrawerFilters(INITIAL_FILTERS)}
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleOpenDeleteProjectConfirm}
        onImportProjects={handleImportProjects}
        clientsList={accountsList}
      />

      {/* 5. Add/Edit Account Modal Form */}
      <Modal
        isOpen={isCreateAccountOpen || !!editingAccount}
        onClose={() => {
          setIsCreateAccountOpen(false);
          setEditingAccount(null);
        }}
        title={editingAccount ? `Edit Account: ${editingAccount.name}` : 'Provision Client Account'}
        size="lg"
      >
        <form onSubmit={handleAccountSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Name */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Account Name <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="text"
                value={accountForm.name}
                onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Pfizer Inc."
                className={`w-full py-2 px-3 rounded-lg border text-sm outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                  accountFormErrors.name ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {accountFormErrors.name && <span className="text-xs text-accent font-semibold">{accountFormErrors.name}</span>}
            </div>

            {/* Global Lead */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Global Lead <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="text"
                value={accountForm.globalLead}
                onChange={(e) => setAccountForm(prev => ({ ...prev, globalLead: e.target.value }))}
                placeholder="e.g. Sarah Jenkins"
                className={`w-full py-2 px-3 rounded-lg border text-sm outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                  accountFormErrors.globalLead ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {accountFormErrors.globalLead && <span className="text-xs text-accent font-semibold">{accountFormErrors.globalLead}</span>}
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Market Region
              </label>
              <select
                value={accountForm.region}
                onChange={(e) => setAccountForm(prev => ({ ...prev, region: e.target.value }))}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 text-sm outline-none cursor-pointer"
              >
                <option value="Global / NA">Global / NA</option>
                <option value="Europe">Europe</option>
                <option value="Global / UK">Global / UK</option>
                <option value="Europe / Swiss">Europe / Swiss</option>
                <option value="North America">North America</option>
                <option value="Global">Global</option>
              </select>
            </div>

            {/* Tier Classification */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Tier Classification
              </label>
              <select
                value={accountForm.tier}
                onChange={(e) => setAccountForm(prev => ({ ...prev, tier: e.target.value }))}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 text-sm outline-none cursor-pointer"
              >
                <option value="Strategic Platinum">Strategic Platinum</option>
                <option value="Enterprise Gold">Enterprise Gold</option>
                <option value="Growth Silver">Growth Silver</option>
              </select>
            </div>

            {/* Contact Email */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Contact Email <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="email"
                value={accountForm.contactEmail}
                onChange={(e) => setAccountForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="procurement@client.com"
                className={`w-full py-2 px-3 rounded-lg border text-sm outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                  accountFormErrors.contactEmail ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {accountFormErrors.contactEmail && <span className="text-xs text-accent font-semibold">{accountFormErrors.contactEmail}</span>}
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Country <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="text"
                value={accountForm.country}
                onChange={(e) => setAccountForm(prev => ({ ...prev, country: e.target.value }))}
                placeholder="e.g. United States"
                className={`w-full py-2 px-3 rounded-lg border text-sm outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                  accountFormErrors.country ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {accountFormErrors.country && <span className="text-xs text-accent font-semibold">{accountFormErrors.country}</span>}
            </div>

            {/* Corporate Website */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Corporate Website URL <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="text"
                value={accountForm.website}
                onChange={(e) => setAccountForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="e.g. https://www.pfizer.com"
                className={`w-full py-2 px-3 rounded-lg border text-sm outline-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 ${
                  accountFormErrors.website ? 'border-accent' : 'border-gray-200 dark:border-gray-800'
                }`}
              />
              {accountFormErrors.website && <span className="text-xs text-accent font-semibold">{accountFormErrors.website}</span>}
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Industry
              </label>
              <select
                value={accountForm.industry}
                onChange={(e) => setAccountForm(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 text-sm outline-none cursor-pointer"
              >
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Medical Devices">Medical Devices</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Account description
            </label>
            <textarea
              value={accountForm.description}
              onChange={(e) => setAccountForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of partnership details..."
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-sm outline-none resize-none bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 focus:border-primary"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 dark:border-gray-850 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsCreateAccountOpen(false);
                setEditingAccount(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingAccount ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Account Delete Confirmation Modal */}
      <ConfirmationDialog 
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDeleteAccountConfirm}
        title="Confirm Account Deletion"
        message={deletingAccount ? `Are you sure you want to delete client account "${deletingAccount.name}"? This will permanently delete the account and all 48 linked capability projects from the in-memory state.` : ''}
        confirmLabel="Delete Account"
        cancelLabel="Discard"
      />

      {/* 7. Project Delete Confirmation Modal */}
      <ConfirmationDialog 
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProjectConfirm}
        title="Confirm Project Deletion"
        message={deletingProject ? `Are you sure you want to delete project "${deletingProject.projectName}" (${deletingProject.projectCode})? This action will remove the record from charts and spreadsheets.` : ''}
        confirmLabel="Delete Project"
        cancelLabel="Discard"
      />

    </div>
  );
};

export default AccountsView;
