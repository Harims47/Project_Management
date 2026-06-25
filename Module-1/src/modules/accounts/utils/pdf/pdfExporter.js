import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

export const exportProjectsToPdf = (projects = [], filters = {}, account = null) => {
  const doc = new jsPDF();
  
  // Document Header
  doc.setFillColor(21, 82, 166); // Theme primary color: blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('INDEGENE CLIENT PORTFOLIO REPORT', 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Corporate Portfolio System • Confidentially Exported', 14, 25);
  doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, 31);
  
  // Client Account Dossier
  let currentY = 48;
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39); // Gray 900
  doc.setFont('helvetica', 'bold');
  doc.text('Client Dossier Profile', 14, currentY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // Gray 600
  
  const accountName = account ? account.name : 'All Enterprise Client Accounts';
  const globalLead = account ? account.globalLead : 'All Account Teams';
  const region = account ? account.region : 'Global';
  const country = account ? account.country || 'N/A' : 'All Regions';
  const industry = account ? account.industry || 'Life Sciences' : 'Pharmaceuticals / Healthcare';

  doc.text(`Account Name:  ${accountName}`, 14, currentY + 7);
  doc.text(`Global Lead:   ${globalLead}`, 14, currentY + 13);
  doc.text(`Region:        ${region} (${country})`, 14, currentY + 19);
  doc.text(`Industry:      ${industry}`, 14, currentY + 25);

  // Filters applied summary box
  doc.setDrawColor(229, 231, 235); // Gray 200
  doc.setFillColor(249, 250, 251); // Gray 50
  doc.rect(14, currentY + 31, 182, 18, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text('Applied Filter Parameters:', 18, currentY + 37);
  
  const searchStr = filters.search || 'None';
  const serviceStr = filters.service || 'All';
  const statusStr = filters.status || 'All';
  const minRevStr = filters.minRevenue ? `$${Number(filters.minRevenue).toLocaleString()}` : 'None';
  const maxRevStr = filters.maxRevenue ? `$${Number(filters.maxRevenue).toLocaleString()}` : 'None';
  
  doc.text(
    `Search: ${searchStr}  |  Capability: ${serviceStr}  |  Status: ${statusStr}  |  Revenue Range: ${minRevStr} - ${maxRevStr}`,
    18, 
    currentY + 43
  );

  // Summary Metrics Table
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
  const totalProjectsCount = projects.length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
  const pipelineCount = projects.filter(p => p.status === 'Pipeline').length;
  const cancelledCount = projects.filter(p => p.status === 'Cancelled').length;

  doc.autoTable({
    startY: currentY + 54,
    head: [['Metric', 'Total Projects', 'Completed', 'Ongoing', 'Pipeline', 'Cancelled', 'Aggregate Revenue']],
    body: [
      [
        'Aggregates',
        totalProjectsCount,
        completedCount,
        ongoingCount,
        pipelineCount,
        cancelledCount,
        `$${totalRevenue.toLocaleString()}`
      ]
    ],
    theme: 'striped',
    styles: { fontSize: 9, fontStyle: 'bold', halign: 'center' },
    headStyles: { fillColor: [75, 85, 99] }
  });

  // Projects Grid Table
  const tableRows = projects.map(p => [
    p.projectCode,
    p.projectName,
    p.manager,
    p.service,
    p.status,
    `$${p.revenue.toLocaleString()}`,
    p.startDate,
    p.endDate
  ]);

  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('Filtered Projects Matrix', 14, doc.lastAutoTable.finalY + 10);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 14,
    head: [['Code', 'Project Name', 'Manager', 'Capability', 'Status', 'Revenue', 'Start Date', 'End Date']],
    body: tableRows,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [21, 82, 166] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 16 },
      1: { cellWidth: 38 },
      2: { cellWidth: 26 },
      5: { fontStyle: 'bold', halign: 'right' }
    }
  });

  // Save/Download PDF document
  const safeName = (account ? account.name : 'All_Accounts').toLowerCase().replace(/[^a-z0-9]+/g, '_');
  doc.save(`${safeName}_portfolio_report.pdf`);
};

export default {
  exportProjectsToPdf
};
