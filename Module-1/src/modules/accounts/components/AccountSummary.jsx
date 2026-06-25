import React from 'react';
import { Card } from '../../../components/cards/DashboardCards';
import { Users, Globe, ExternalLink, Star, Mail, Briefcase, DollarSign } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';

export const AccountSummary = ({ account, projects }) => {
  if (!account) return null;

  // Compute stats on the fly for future-readiness
  const creativeCount = projects.filter(p => p.service === 'Creative').length;
  const digitalCount = projects.filter(p => p.service === 'Digital').length;
  const researchCount = projects.filter(p => p.service === 'Research').length;
  const videoCount = projects.filter(p => p.service === 'Video').length;
  
  const totalRevenueVal = projects.reduce((sum, p) => sum + p.revenue, 0);
  const monthlyRunRate = Math.round(totalRevenueVal / 6); // Mock 6 months average

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 text-left mb-6">
      {/* Client Profile and Corporate Information */}
      <Card className="p-5 flex flex-col gap-4 border-t-2 border-primary">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
            Account & Client Information
          </h4>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
            {account.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <span className="block text-gray-400 dark:text-gray-500 uppercase tracking-wide">Industry</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{account.industry}</span>
          </div>
          <div>
            <span className="block text-gray-400 dark:text-gray-500 uppercase tracking-wide">Country</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{account.country}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-gray-400 dark:text-gray-500 uppercase tracking-wide">Corporate Website</span>
            <a 
              href={account.website} 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-primary dark:text-primary-light hover:underline inline-flex items-center gap-1 font-bold"
            >
              {account.website}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div>
            <span className="block text-gray-400 dark:text-gray-500 uppercase tracking-wide">Global Lead</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              {account.globalLead}
            </span>
          </div>
          <div>
            <span className="block text-gray-400 dark:text-gray-500 uppercase tracking-wide">Contact Email</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 inline-flex items-center gap-1 break-all">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              {account.contactEmail}
            </span>
          </div>
        </div>
      </Card>

      {/* Services & Revenue Summaries */}
      <Card className="p-5 flex flex-col justify-between gap-4 border-t-2 border-secondary">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Capability Line Allocation & Revenue
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-500 font-bold text-sm h-8 w-8 flex items-center justify-center">
                CR
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">Creative</span>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{creativeCount} Projects</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-sky-500/10 text-sky-500 font-bold text-sm h-8 w-8 flex items-center justify-center">
                DG
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">Digital</span>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{digitalCount} Projects</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 font-bold text-sm h-8 w-8 flex items-center justify-center">
                RS
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">Research</span>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{researchCount} Projects</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-rose-500/10 text-rose-500 font-bold text-sm h-8 w-8 flex items-center justify-center">
                VD
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black">Video</span>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">{videoCount} Projects</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 grid grid-cols-2 gap-4 font-semibold text-xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-500">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase">Portfolio Value</span>
              <span className="text-sm font-black text-gray-800 dark:text-gray-200">
                ${totalRevenueVal.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-blue-500/10 text-blue-500">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase">Monthly Run Rate</span>
              <span className="text-sm font-black text-gray-800 dark:text-gray-200">
                ${monthlyRunRate.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountSummary;
