using API.DTOs.v1;
using API.DTOs.v1.Dashboard;
using API.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync(DashboardFilterRequest filter)
        {
            var summary = await _repository.GetSummaryAsync(filter);
            return ApiResponse<DashboardSummaryDto>.CreateSuccess(summary, "Dashboard summary calculated successfully.");
        }

        public async Task<ApiResponse<List<ServiceAnalyticsDto>>> GetServicesDistributionAsync(DashboardFilterRequest filter)
        {
            var serviceDistribution = await _repository.GetServiceDistributionAsync(filter);
            return ApiResponse<List<ServiceAnalyticsDto>>.CreateSuccess(serviceDistribution, "Service distribution calculated successfully.");
        }

        public async Task<ApiResponse<List<StatusAnalyticsDto>>> GetStatusDistributionAsync(DashboardFilterRequest filter)
        {
            var statusDistribution = await _repository.GetStatusDistributionAsync(filter);
            return ApiResponse<List<StatusAnalyticsDto>>.CreateSuccess(statusDistribution, "Status distribution calculated successfully.");
        }

        public async Task<ApiResponse<List<MonthlyTrendDto>>> GetMonthlyTrendAsync(DashboardFilterRequest filter)
        {
            var monthlyTrend = await _repository.GetMonthlyTrendAsync(filter);
            return ApiResponse<List<MonthlyTrendDto>>.CreateSuccess(monthlyTrend, "Monthly trend calculated successfully.");
        }

        public async Task<ApiResponse<RevenueAnalyticsDto>> GetRevenueAnalyticsAsync(DashboardFilterRequest filter)
        {
            var revenueAnalytics = await _repository.GetRevenueAnalyticsAsync(filter);
            return ApiResponse<RevenueAnalyticsDto>.CreateSuccess(revenueAnalytics, "Revenue analytics calculated successfully.");
        }

        public async Task<ApiResponse<List<ManagerAnalyticsDto>>> GetManagersWorkloadAsync(DashboardFilterRequest filter)
        {
            var managersWorkload = await _repository.GetManagerWorkloadAsync(filter);
            return ApiResponse<List<ManagerAnalyticsDto>>.CreateSuccess(managersWorkload, "Manager workloads calculated successfully.");
        }

        public async Task<ApiResponse<List<TopAccountDto>>> GetTopAccountsAsync(DashboardFilterRequest filter)
        {
            var topAccounts = await _repository.GetTopAccountsAsync(filter);
            return ApiResponse<List<TopAccountDto>>.CreateSuccess(topAccounts, "Top accounts ranked successfully.");
        }
    }
}
