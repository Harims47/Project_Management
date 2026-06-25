using API.DTOs.v1.Dashboard;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetSummaryAsync(DashboardFilterRequest filter);
        Task<List<ServiceAnalyticsDto>> GetServiceDistributionAsync(DashboardFilterRequest filter);
        Task<List<StatusAnalyticsDto>> GetStatusDistributionAsync(DashboardFilterRequest filter);
        Task<List<MonthlyTrendDto>> GetMonthlyTrendAsync(DashboardFilterRequest filter);
        Task<RevenueAnalyticsDto> GetRevenueAnalyticsAsync(DashboardFilterRequest filter);
        Task<List<ManagerAnalyticsDto>> GetManagerWorkloadAsync(DashboardFilterRequest filter);
        Task<List<TopAccountDto>> GetTopAccountsAsync(DashboardFilterRequest filter);
    }
}
