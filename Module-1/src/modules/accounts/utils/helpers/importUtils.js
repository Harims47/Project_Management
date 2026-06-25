/**
 * Maps parsed excel rows to the standard system schema format.
 */
export const mapImportedRowsToSchema = (rows = [], selectedAccountId = null, accountObj = null, clientsList = []) => {
  return rows.map((r, index) => {
    const uniqueId = `proj-imported-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`;
    
    // Determine client properties
    let finalClientId = selectedAccountId;
    let finalClientName = accountObj ? accountObj.name : '';

    if (!finalClientId) {
      // Look up clientId from the row client name
      const rowClientName = String(r.clientName).toLowerCase().trim();
      const matchedClient = clientsList.find(c => 
        c.name.toLowerCase().trim() === rowClientName || 
        c.id.toLowerCase().trim() === rowClientName
      );
      
      if (matchedClient) {
        finalClientId = matchedClient.id;
        finalClientName = matchedClient.name;
      } else {
        // Fallback to first client in system or default
        finalClientId = clientsList[0]?.id || 'pfizer';
        finalClientName = clientsList[0]?.name || 'Pfizer Inc.';
      }
    }

    return {
      id: uniqueId,
      projectCode: String(r.projectCode).trim().toUpperCase(),
      projectName: String(r.projectName).trim(),
      clientId: finalClientId,
      clientName: finalClientName,
      manager: String(r.manager).trim(),
      service: String(r.service).trim(),
      status: String(r.status).trim(),
      revenue: Number(r.revenue),
      startDate: r.startDate,
      endDate: r.endDate,
      remarks: r.remarks ? String(r.remarks).trim() : ''
    };
  });
};

export default mapImportedRowsToSchema;
