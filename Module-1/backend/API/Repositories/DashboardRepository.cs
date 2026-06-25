using API.Data;
using API.DTOs.v1.Dashboard;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _context;

        public DashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<Project> ApplyFilters(IQueryable<Project> query, DashboardFilterRequest filter)
        {
            if (!string.IsNullOrWhiteSpace(filter.AccountId) && Guid.TryParse(filter.AccountId, out var parsedGuid))
            {
                query = query.Where(p => p.AccountId == parsedGuid);
            }

            if (!string.IsNullOrWhiteSpace(filter.Service))
            {
                query = query.Where(p => p.Service.ServiceName == filter.Service);
            }

            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                query = query.Where(p => p.Status.StatusName == filter.Status);
            }

            if (!string.IsNullOrWhiteSpace(filter.Manager))
            {
                query = query.Where(p => p.Manager == filter.Manager);
            }

            if (!string.IsNullOrWhiteSpace(filter.StartDate) && DateTime.TryParse(filter.StartDate, out var sDate))
            {
                query = query.Where(p => p.StartDate >= sDate);
            }

            if (!string.IsNullOrWhiteSpace(filter.EndDate) && DateTime.TryParse(filter.EndDate, out var eDate))
            {
                query = query.Where(p => p.EndDate <= eDate);
            }

            if (filter.RevenueMin.HasValue)
            {
                query = query.Where(p => p.Revenue >= filter.RevenueMin.Value);
            }

            if (filter.RevenueMax.HasValue)
            {
                query = query.Where(p => p.Revenue <= filter.RevenueMax.Value);
            }

            return query;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var projects = await baseQuery
                .Select(p => new { p.Revenue, StatusName = p.Status.StatusName })
                .ToListAsync();

            var totalProjects = projects.Count;
            var totalRevenue = projects.Sum(p => p.Revenue);
            var completedProjects = projects.Count(p => p.StatusName == "Completed");
            var pipelineProjects = projects.Count(p => p.StatusName == "Pipeline");
            var cancelledProjects = projects.Count(p => p.StatusName == "Cancelled");
            var ongoingProjects = projects.Count(p => p.StatusName == "Ongoing");
            var activeProjects = ongoingProjects + completedProjects + pipelineProjects;

            var accountsQuery = _context.Accounts.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(filter.AccountId) && Guid.TryParse(filter.AccountId, out var parsedGuid))
            {
                accountsQuery = accountsQuery.Where(a => a.AccountId == parsedGuid);
            }
            var totalAccounts = await accountsQuery.CountAsync();

            return new DashboardSummaryDto
            {
                TotalAccounts = totalAccounts,
                TotalProjects = totalProjects,
                TotalRevenue = totalRevenue,
                ActiveProjects = activeProjects,
                CompletedProjects = completedProjects,
                PipelineProjects = pipelineProjects,
                CancelledProjects = cancelledProjects,
                OngoingProjects = ongoingProjects
            };
        }

        public async Task<List<ServiceAnalyticsDto>> GetServiceDistributionAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var grouped = await baseQuery
                .GroupBy(p => p.Service.ServiceName)
                .Select(g => new
                {
                    ServiceName = g.Key,
                    TotalProjects = g.Count(),
                    Revenue = g.Sum(p => p.Revenue),
                    Completed = g.Count(p => p.Status.StatusName == "Completed"),
                    Active = g.Count(p => p.Status.StatusName != "Cancelled")
                })
                .ToListAsync();

            return grouped.Select(x => new ServiceAnalyticsDto
            {
                ServiceName = x.ServiceName,
                TotalProjects = x.TotalProjects,
                Revenue = x.Revenue,
                CompletionPercentage = x.TotalProjects > 0 ? (double)x.Completed * 100.0 / x.TotalProjects : 0.0,
                ActiveProjects = x.Active
            }).ToList();
        }

        public async Task<List<StatusAnalyticsDto>> GetStatusDistributionAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var grouped = await baseQuery
                .GroupBy(p => p.Status.StatusName)
                .Select(g => new
                {
                    StatusName = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var total = grouped.Sum(x => x.Count);

            return grouped.Select(x => new StatusAnalyticsDto
            {
                StatusName = x.StatusName,
                Count = x.Count,
                Percentage = total > 0 ? (double)x.Count * 100.0 / total : 0.0
            }).ToList();
        }

        public async Task<List<MonthlyTrendDto>> GetMonthlyTrendAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var grouped = await baseQuery
                .GroupBy(p => p.StartDate.Month)
                .Select(g => new
                {
                    MonthNum = g.Key,
                    ProjectsCreated = g.Count(),
                    Revenue = g.Sum(p => p.Revenue),
                    Completed = g.Count(p => p.Status.StatusName == "Completed")
                })
                .ToListAsync();

            var monthsMap = new Dictionary<int, string>
            {
                { 1, "Jan" }, { 2, "Feb" }, { 3, "Mar" },
                { 4, "Apr" }, { 5, "May" }, { 6, "Jun" },
                { 7, "Jul" }, { 8, "Aug" }, { 9, "Sep" },
                { 10, "Oct" }, { 11, "Nov" }, { 12, "Dec" }
            };

            return grouped.Select(x => new MonthlyTrendDto
            {
                Month = monthsMap.TryGetValue(x.MonthNum, out var m) ? m : $"Month-{x.MonthNum}",
                ProjectsCreated = x.ProjectsCreated,
                Revenue = x.Revenue,
                Completion = x.ProjectsCreated > 0 ? (double)x.Completed * 100.0 / x.ProjectsCreated : 0.0
            })
            .OrderBy(x => monthsMap.FirstOrDefault(kv => kv.Value == x.Month).Key)
            .ToList();
        }

        public async Task<RevenueAnalyticsDto> GetRevenueAnalyticsAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            // Group by Service
            var byService = await baseQuery
                .GroupBy(p => p.Service.ServiceName)
                .Select(g => new RevenueGroupDto
                {
                    GroupName = g.Key,
                    Revenue = g.Sum(p => p.Revenue)
                })
                .ToListAsync();

            // Group by Month
            var groupedByMonthNum = await baseQuery
                .GroupBy(p => p.StartDate.Month)
                .Select(g => new
                {
                    MonthNum = g.Key,
                    Revenue = g.Sum(p => p.Revenue)
                })
                .ToListAsync();

            var monthsMap = new Dictionary<int, string>
            {
                { 1, "Jan" }, { 2, "Feb" }, { 3, "Mar" },
                { 4, "Apr" }, { 5, "May" }, { 6, "Jun" },
                { 7, "Jul" }, { 8, "Aug" }, { 9, "Sep" },
                { 10, "Oct" }, { 11, "Nov" }, { 12, "Dec" }
            };

            var byMonth = groupedByMonthNum.Select(x => new RevenueGroupDto
            {
                GroupName = monthsMap.TryGetValue(x.MonthNum, out var m) ? m : $"Month-{x.MonthNum}",
                Revenue = x.Revenue
            })
            .OrderBy(x => monthsMap.FirstOrDefault(kv => kv.Value == x.GroupName).Key)
            .ToList();

            // Group by Account
            var byAccount = await baseQuery
                .GroupBy(p => p.Account.AccountName)
                .Select(g => new RevenueGroupDto
                {
                    GroupName = g.Key,
                    Revenue = g.Sum(p => p.Revenue)
                })
                .ToListAsync();

            return new RevenueAnalyticsDto
            {
                ByService = byService,
                ByMonth = byMonth,
                ByAccount = byAccount
            };
        }

        public async Task<List<ManagerAnalyticsDto>> GetManagerWorkloadAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var grouped = await baseQuery
                .GroupBy(p => p.Manager)
                .Select(g => new ManagerAnalyticsDto
                {
                    Manager = g.Key,
                    ProjectCount = g.Count(),
                    Revenue = g.Sum(p => p.Revenue),
                    CompletedProjects = g.Count(p => p.Status.StatusName == "Completed"),
                    OngoingProjects = g.Count(p => p.Status.StatusName == "Ongoing")
                })
                .OrderByDescending(x => x.ProjectCount)
                .ToListAsync();

            return grouped;
        }

        public async Task<List<TopAccountDto>> GetTopAccountsAsync(DashboardFilterRequest filter)
        {
            var baseQuery = _context.Projects.AsNoTracking();
            baseQuery = ApplyFilters(baseQuery, filter);

            var grouped = await baseQuery
                .GroupBy(p => new { p.AccountId, p.Account.AccountName })
                .Select(g => new
                {
                    AccountId = g.Key.AccountId.ToString(),
                    AccountName = g.Key.AccountName,
                    Revenue = g.Sum(p => p.Revenue),
                    ProjectsCount = g.Count(),
                    CompletedCount = g.Count(p => p.Status.StatusName == "Completed")
                })
                .ToListAsync();

            return grouped.Select(x => new TopAccountDto
            {
                AccountId = x.AccountId,
                AccountName = x.AccountName,
                Revenue = x.Revenue,
                ProjectsCount = x.ProjectsCount,
                CompletionRate = x.ProjectsCount > 0 ? (double)x.CompletedCount * 100.0 / x.ProjectsCount : 0.0
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();
        }
    }
}
