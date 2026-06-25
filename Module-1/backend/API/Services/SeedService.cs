using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class SeedService : ISeedService
    {
        private readonly AppDbContext _context;

        public SeedService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Apply migrations dynamically
            await _context.Database.MigrateAsync();

            // 1. Seed Services
            if (!await _context.Services.AnyAsync())
            {
                var services = new List<Service>
                {
                    new Service { ServiceId = 1, ServiceName = "Creative" },
                    new Service { ServiceId = 2, ServiceName = "Digital" },
                    new Service { ServiceId = 3, ServiceName = "Research" },
                    new Service { ServiceId = 4, ServiceName = "Video" }
                };
                await _context.Services.AddRangeAsync(services);
                await _context.SaveChangesAsync();
            }

            // 2. Seed Project Statuses
            if (!await _context.ProjectStatuses.AnyAsync())
            {
                var statuses = new List<ProjectStatus>
                {
                    new ProjectStatus { StatusId = 1, StatusName = "Completed" },
                    new ProjectStatus { StatusId = 2, StatusName = "Ongoing" },
                    new ProjectStatus { StatusId = 3, StatusName = "Pipeline" },
                    new ProjectStatus { StatusId = 4, StatusName = "Cancelled" }
                };
                await _context.ProjectStatuses.AddRangeAsync(statuses);
                await _context.SaveChangesAsync();
            }

            // 3. Seed Accounts
            if (!await _context.Accounts.AnyAsync())
            {
                var accounts = new List<Account>
                {
                    new Account
                    {
                        AccountId = new Guid("9fca8cf5-75e1-4560-aa25-1e30a597a7bb"),
                        AccountName = "Pfizer Inc.",
                        GlobalLead = "Sarah Jenkins",
                        DeliveryManager = "Sarah Jenkins",
                        Region = "Global / NA",
                        Industry = "Pharmaceuticals",
                        Country = "United States",
                        Website = "https://www.pfizer.com",
                        Status = "Active",
                        Tier = "Strategic Platinum",
                        Description = "Pfizer Inc. is a leading global biopharmaceutical company focusing on drug discovery, vaccine developments, and immunology breakthroughs.",
                        ContactEmail = "pfizer.lead@indegene.com"
                    },
                    new Account
                    {
                        AccountId = new Guid("160d5bfa-22f3-42e1-a0a1-4ee6246473bb"),
                        AccountName = "Novartis AG",
                        GlobalLead = "Alex Mercer",
                        DeliveryManager = "Alex Mercer",
                        Region = "Europe",
                        Industry = "Pharmaceuticals",
                        Country = "Switzerland",
                        Website = "https://www.novartis.com",
                        Status = "Active",
                        Tier = "Enterprise Gold",
                        Description = "Novartis AG reimagines medicine to improve and extend people's lives. They address some of society's most challenging healthcare issues.",
                        ContactEmail = "novartis.lead@indegene.com"
                    },
                    new Account
                    {
                        AccountId = new Guid("2dca9af5-11e2-4110-aa55-1f30c597b7bb"),
                        AccountName = "AstraZeneca",
                        GlobalLead = "David Vance",
                        DeliveryManager = "David Vance",
                        Region = "Global / UK",
                        Industry = "Pharmaceuticals",
                        Country = "United Kingdom",
                        Website = "https://www.astrazeneca.com",
                        Status = "Active",
                        Tier = "Strategic Platinum",
                        Description = "AstraZeneca is a global science-led biopharmaceutical company focused on oncology, rare diseases, cardiovascular, and respiratory medicines.",
                        ContactEmail = "astrazeneca.lead@indegene.com"
                    },
                    new Account
                    {
                        AccountId = new Guid("3bc1f9fa-2cf3-41e1-a0a1-4ee6246473aa"),
                        AccountName = "Roche Holding",
                        GlobalLead = "Elena Rostova",
                        DeliveryManager = "Elena Rostova",
                        Region = "Europe / Swiss",
                        Industry = "Biotechnology",
                        Country = "Switzerland",
                        Website = "https://www.roche.com",
                        Status = "Active",
                        Tier = "Enterprise Gold",
                        Description = "F. Hoffmann-La Roche AG is a Swiss multinational healthcare company that operates worldwide under two divisions: Pharmaceuticals and Diagnostics.",
                        ContactEmail = "roche.lead@indegene.com"
                    },
                    new Account
                    {
                        AccountId = new Guid("4dfc5bfa-11e3-41e1-a0a2-4ee6246473ab"),
                        AccountName = "Merck & Co.",
                        GlobalLead = "Marcus Brody",
                        DeliveryManager = "Marcus Brody",
                        Region = "North America",
                        Industry = "Pharmaceuticals",
                        Country = "United States",
                        Website = "https://www.merck.com",
                        Status = "Active",
                        Tier = "Growth Silver",
                        Description = "Merck & Co., Inc. delivers innovative health solutions through prescription medicines, vaccines, biologic therapies, and animal health products.",
                        ContactEmail = "merck.lead@indegene.com"
                    },
                    new Account
                    {
                        AccountId = new Guid("5efca8cf-11e1-4560-aa25-1e30a597a7bc"),
                        AccountName = "Johnson & Johnson",
                        GlobalLead = "Emma Stone",
                        DeliveryManager = "Emma Stone",
                        Region = "Global",
                        Industry = "Healthcare",
                        Country = "United States",
                        Website = "https://www.jnj.com",
                        Status = "Active",
                        Tier = "Growth Silver",
                        Description = "Johnson & Johnson is the world's largest and most broadly based healthcare company, dedicated to developing medical devices and pharmaceuticals.",
                        ContactEmail = "jnj.lead@indegene.com"
                    }
                };

                await _context.Accounts.AddRangeAsync(accounts);
                await _context.SaveChangesAsync();
            }

            // 4. Seed Projects
            if (!await _context.Projects.AnyAsync())
            {
                var accountsList = await _context.Accounts.ToListAsync();
                var servicesList = await _context.Services.ToListAsync();
                var statusesList = await _context.ProjectStatuses.ToListAsync();

                var managers = new[]
                {
                    "Sarah Jenkins", "Alex Mercer", "David Vance", "Elena Rostova",
                    "Marcus Brody", "Emma Stone", "Robert Chen", "Lisa Kudrow", "Peter Parker"
                };

                var projectsList = new List<Project>();
                int index = 1;

                foreach (var acc in accountsList)
                {
                    string shortClientName = acc.AccountName.Split(' ')[0];
                    foreach (var srv in servicesList)
                    {
                        for (int pNum = 1; pNum <= 12; pNum++)
                        {
                            int codeNum = 1000 + index;
                            string projectCode = $"{srv.ServiceName.Substring(0, 2).ToUpper()}-{codeNum}";

                            string projectName = srv.ServiceName switch
                            {
                                "Creative" => $"{shortClientName} Brand Asset Design V{pNum}",
                                "Digital" => $"{shortClientName} Web Portal Dev Phase {pNum}",
                                "Research" => $"{shortClientName} Clinical Study Analysis #{pNum}",
                                _ => $"{shortClientName} Educational Patient Video #{pNum}"
                            };

                            // Distribute status
                            // Completed: 1-4, Ongoing: 5-8, Pipeline: 9-11, Cancelled: 12
                            int statusId = 1; // Completed
                            if (pNum > 4 && pNum <= 8) statusId = 2; // Ongoing
                            else if (pNum > 8 && pNum <= 11) statusId = 3; // Pipeline
                            else if (pNum > 11) statusId = 4; // Cancelled

                            string manager = managers[index % managers.Length];
                            decimal revenue = 15000 + ((index * 83) % 136) * 1000;

                            int startMonth = 1 + (index % 6);
                            var startDate = new DateTime(2026, startMonth, 10);
                            int endMonth = startMonth + 2;
                            var endDate = new DateTime(2026, endMonth, 15);

                            string remarks = $"Operational delivery for {srv.ServiceName} capability line mapped under status {statusesList.First(s => s.StatusId == statusId).StatusName}.";

                            projectsList.Add(new Project
                            {
                                ProjectId = Guid.NewGuid(),
                                AccountId = acc.AccountId,
                                ProjectCode = projectCode,
                                ProjectName = projectName,
                                ServiceId = srv.ServiceId,
                                StatusId = statusId,
                                Manager = manager,
                                Revenue = revenue,
                                StartDate = startDate,
                                EndDate = endDate,
                                Remarks = remarks,
                                CreatedBy = "System",
                                UpdatedBy = "System",
                                CreatedDate = DateTime.UtcNow,
                                UpdatedDate = DateTime.UtcNow,
                                IsActive = true
                            });

                            index++;
                        }
                    }
                }

                await _context.Projects.AddRangeAsync(projectsList);
                await _context.SaveChangesAsync();
            }
        }
    }
}
