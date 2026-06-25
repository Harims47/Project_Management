// Dynamic Project Mock Data Generator
const generateProjects = () => {
  const accounts = ['pfizer', 'novartis', 'astrazeneca', 'roche', 'merck', 'jnj'];
  const services = ['Creative', 'Digital', 'Research', 'Video'];
  const managers = [
    'Sarah Jenkins', 'Alex Mercer', 'David Vance', 'Elena Rostova', 
    'Marcus Brody', 'Emma Stone', 'Robert Chen', 'Lisa Kudrow', 'Peter Parker'
  ];
  
  const clientNames = {
    pfizer: 'Pfizer Inc.',
    novartis: 'Novartis AG',
    astrazeneca: 'AstraZeneca',
    roche: 'Roche Holding',
    merck: 'Merck & Co.',
    jnj: 'Johnson & Johnson'
  };

  const projects = [];
  let index = 1;
  
  for (const accountId of accounts) {
    const clientName = clientNames[accountId];
    for (const service of services) {
      for (let pNum = 1; pNum <= 12; pNum++) {
        const id = `proj-${accountId}-${service.toLowerCase()}-${pNum}`;
        const codeNum = 1000 + index;
        const projectCode = `${service.substring(0, 2).toUpperCase()}-${codeNum}`;
        
        // Generate a realistic project name
        let projectName = '';
        if (service === 'Creative') {
          projectName = `${clientName.split(' ')[0]} Brand Asset Design V${pNum}`;
        } else if (service === 'Digital') {
          projectName = `${clientName.split(' ')[0]} Web Portal Dev Phase ${pNum}`;
        } else if (service === 'Research') {
          projectName = `${clientName.split(' ')[0]} Clinical Study Analysis #${pNum}`;
        } else {
          projectName = `${clientName.split(' ')[0]} Educational Patient Video #${pNum}`;
        }
        
        // Distribute status
        // Completed: 1-4, Ongoing: 5-8, Pipeline: 9-11, Cancelled: 12
        let status = 'Completed';
        if (pNum > 4 && pNum <= 8) status = 'Ongoing';
        else if (pNum > 8 && pNum <= 11) status = 'Pipeline';
        else if (pNum > 11) status = 'Cancelled';
        
        const manager = managers[(index) % managers.length];
        
        // Revenue: from $15,000 to $150,000
        const revenue = 15000 + ((index * 83) % 136) * 1000;
        
        // Start date: 2026-01 to 2026-06
        const startMonth = 1 + (index % 6);
        const startDate = `2026-0${startMonth}-10`;
        const endMonth = startMonth + 2;
        const endDate = `2026-0${endMonth > 9 ? endMonth : `0${endMonth}`}-15`;
        
        const remarks = `Operational delivery for ${service} capability line mapped under status ${status}.`;
        
        projects.push({
          id,
          projectCode,
          projectName,
          clientId: accountId,
          clientName,
          manager,
          service,
          status,
          revenue,
          startDate,
          endDate,
          remarks
        });
        
        index++;
      }
    }
  }
  return projects;
};

export const projects = generateProjects();
export default projects;
