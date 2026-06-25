using API.DTOs.v1;
using API.DTOs.v1.Dashboard;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IDashboardService
    {
        Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync(DashboardFilterRequest filter);
        Task<ApiResponse<List<ServiceAnalyticsDto>>> GetServicesDistributionAsync(DashboardFilterRequest filter);
        Task<ApiResponse<List<StatusAnalyticsDto>>> GetStatusDistributionAsync(DashboardFilterRequest filter);
        Task<ApiResponse<List<MonthlyTrendDto>>> GetMonthlyTrendAsync(DashboardFilterRequest filter);
        Task<ApiResponse<RevenueAnalyticsDto>> GetRevenueAnalyticsAsync(DashboardFilterRequest filter);
        Task<ApiResponse<List<ManagerAnalyticsDto>>> GetManagersWorkloadAsync(DashboardFilterRequest filter);
        Task<ApiResponse<List<TopAccountDto>>> GetTopAccountsAsync(DashboardFilterRequest filter);
    }
}
