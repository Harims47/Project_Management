import React, { useState } from 'react';
import { X, Briefcase, Plus, FileSpreadsheet, FileText, CheckCircle, Play, AlertCircle, HelpCircle, Download, Upload } from 'lucide-react';
import AccountSummary from './AccountSummary';
import ProjectFilters from './ProjectFilters';
import ProjectTable from './ProjectTable';
import ProjectCharts from './ProjectCharts';
import ProjectForm from './ProjectForm';
import ExcelUploadModal from './ExcelUploadModal';
import { Button } from '../../../components/ui/Button';
import { exportProjectsToExcel, downloadExcelTemplate } from '../utils/excel/excelExporter';
import { exportProjectsToPdf } from '../utils/pdf/pdfExporter';

export const AccountDrawer = ({
  isOpen,
  onClose,
  account,
  projects = [], // All projects for this client
  filteredProjects = [], // Projects filtered by filters
  allProjects = [], // All projects in system
  filters = {},
  onFilterChange,
  onResetFilters,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onImportProjects,
  clientsList = []
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  if (!isOpen || !account) return null;

  // Aggregate project counts for the service tabs (Creative, Digital, Research, Video)
  const getServiceCount = (service) => {
    return projects.filter(p => p.service === service).length;
  };

  // Aggregate stats for status cards based on current selected service line
  const activeServiceProjects = filters.service 
    ? projects.filter(p => p.service === filters.service)
    : projects;

  const totalCount = activeServiceProjects.length;
  const completedCount = activeServiceProjects.filter(p => p.status === 'Completed').length;
  const ongoingCount = activeServiceProjects.filter(p => p.status === 'Ongoing').length;
  const pipelineCount = activeServiceProjects.filter(p => p.status === 'Pipeline').length;
  const cancelledCount = activeServiceProjects.filter(p => p.status === 'Cancelled').length;
  const activeServiceRevenue = activeServiceProjects.reduce((sum, p) => sum + p.revenue, 0);

  const handleServiceTabClick = (serviceName) => {
    onFilterChange({
      ...filters,
      service: filters.service === serviceName ? '' : serviceName // toggle service filter
    });
  };

  const handleStatusCardClick = (statusName) => {
    onFilterChange({
      ...filters,
      status: filters.status === statusName ? '' : statusName // toggle status filter
    });
  };

  const handleAddProjectClick = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  // Export triggers
  const handleExportExcel = () => {
    exportProjectsToExcel(filteredProjects, filters, account.name);
  };

  const handleExportPDF = () => {
    exportProjectsToPdf(filteredProjects, filters, account);
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  // Dynamically extract managers and statuses from projects array for dropdown filters
  const managersList = Array.from(new Set(projects.map(p => p.manager))).filter(Boolean);
  const servicesList = [
    { value: 'Creative', label: 'Creative' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Research', label: 'Research' },
    { value: 'Video', label: 'Video' }
  ];
  const statusesList = ['Completed', 'Ongoing', 'Pipeline', 'Cancelled'];

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] z-[120] bg-white dark:bg-brandDark-card shadow-2xl transition-transform duration-300 transform translate-x-0 overflow-y-auto border-l border-gray-200 dark:border-gray-800">
        
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-brandDark-card/95 backdrop-blur px-6 py-4 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-150 tracking-tight">
                {account.name} Profile
              </h2>
              <span className="badge badge-primary text-[10px]">{account.tier}</span>
              <span className={`badge ${account.status === 'Active' ? 'badge-success' : 'badge-danger'} text-[10px]`}>
                {account.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-0.5">
              Client Code: {account.id.toUpperCase()} • region: {account.region}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body Scroll Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* SECTION 1: Account Summary Metadata */}
          <AccountSummary account={account} projects={projects} />

          {/* SECTION 2: Service Tabs */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 text-left">
              Capability service Lines
            </h4>
            <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto gap-2 scrollbar-none">
              <button
                onClick={() => onFilterChange({ ...filters, service: '' })}
                className={`py-2.5 px-4 font-bold text-sm border-b-2 whitespace-nowrap transition-all
                  ${!filters.service
                    ? 'border-primary text-primary dark:text-primary-light'
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                All Capabilities ({projects.length})
              </button>
              {servicesList.map(srv => {
                const isActive = filters.service === srv.value;
                const count = getServiceCount(srv.value);
                return (
                  <button
                    key={srv.value}
                    onClick={() => handleServiceTabClick(srv.value)}
                    className={`py-2.5 px-4 font-bold text-sm border-b-2 whitespace-nowrap transition-all
                      ${isActive
                        ? 'border-primary text-primary dark:text-primary-light'
                        : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                  >
                    {srv.value} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Status Quick Statistics Cards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 text-left">
              Capability Status & Revenue ({filters.service || 'All Capabilities'})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Total Projects */}
              <div 
                onClick={() => onFilterChange({ ...filters, status: '' })}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02]
                  ${!filters.status 
                    ? 'bg-primary/5 border-primary/40 dark:border-primary/50' 
                    : 'bg-white dark:bg-brandDark-card border-gray-150 dark:border-gray-850'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Total</span>
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{totalCount}</div>
              </div>

              {/* Completed */}
              <div 
                onClick={() => handleStatusCardClick('Completed')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02]
                  ${filters.status === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/40' 
                    : 'bg-white dark:bg-brandDark-card border-gray-150 dark:border-gray-850'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Done</span>
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{completedCount}</div>
              </div>

              {/* Ongoing */}
              <div 
                onClick={() => handleStatusCardClick('Ongoing')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02]
                  ${filters.status === 'Ongoing'
                    ? 'bg-blue-500/10 border-blue-500/40' 
                    : 'bg-white dark:bg-brandDark-card border-gray-150 dark:border-gray-850'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-blue-500">
                  <Play className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Ongoing</span>
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{ongoingCount}</div>
              </div>

              {/* Pipeline */}
              <div 
                onClick={() => handleStatusCardClick('Pipeline')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02]
                  ${filters.status === 'Pipeline'
                    ? 'bg-amber-500/10 border-amber-500/40' 
                    : 'bg-white dark:bg-brandDark-card border-gray-150 dark:border-gray-850'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-amber-500">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Pipeline</span>
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{pipelineCount}</div>
              </div>

              {/* Cancelled */}
              <div 
                onClick={() => handleStatusCardClick('Cancelled')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02]
                  ${filters.status === 'Cancelled'
                    ? 'bg-rose-500/10 border-rose-500/40' 
                    : 'bg-white dark:bg-brandDark-card border-gray-150 dark:border-gray-850'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Void</span>
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{cancelledCount}</div>
              </div>

              {/* Revenue indicator */}
              <div className="p-3 rounded-lg border border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10 text-left">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Revenue</span>
                </div>
                <div className="text-base font-black text-gray-900 dark:text-gray-150 mt-1.5 truncate">
                  ${activeServiceRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Project Filters Dashboard */}
          <ProjectFilters 
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            managersList={managersList}
            clientsList={clientsList}
            servicesList={servicesList}
            statusesList={statusesList}
          />

          {/* SECTION 5: Inline Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-850 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                icon={FileSpreadsheet} 
                onClick={handleExportExcel}
              >
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={FileText} 
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={Download} 
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={Upload} 
                onClick={() => setIsUploadOpen(true)}
              >
                Upload Excel
              </Button>
            </div>
            
            <Button 
              variant="primary" 
              size="sm" 
              icon={Plus} 
              onClick={handleAddProjectClick}
            >
              Add Project
            </Button>
          </div>

          {/* SECTION 6: Projects Data Table */}
          <ProjectTable 
            projects={filteredProjects}
            onEdit={handleEditProjectClick}
            onDelete={onDeleteProject}
          />

          {/* SECTION 7: Recharts Visualizations */}
          <ProjectCharts filteredProjects={filteredProjects} />

        </div>
      </div>

      {/* Floating Project Form Dialog */}
      <ProjectForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingProject ? (data) => onEditProject(editingProject.projectCode, data) : onAddProject}
        project={editingProject}
        clientsList={clientsList}
        existingProjectsList={allProjects}
      />

      {/* Floating Excel Upload Dialog */}
      <ExcelUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        existingProjects={allProjects}
        onImportConfirm={(validRows, fileName, summary) => {
          onImportProjects(validRows, fileName, summary);
        }}
      />
    </>
  );
};

export default AccountDrawer;
