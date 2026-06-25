using API.DTOs.v1;
using API.DTOs.v1.Dashboard;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace API.Controllers.v1
{
    [ApiController]
    [Route("api/v1/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ApiResponse<DashboardSummaryDto>>> GetSummary([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Summary request received. Account: {Account}", request.AccountId);
            try
            {
                var response = await _dashboardService.GetSummaryAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Summary executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Summary.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate dashboard summary."));
            }
        }

        [HttpGet("services")]
        public async Task<ActionResult<ApiResponse<List<ServiceAnalyticsDto>>>> GetServices([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Services request received.");
            try
            {
                var response = await _dashboardService.GetServicesDistributionAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Services executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Services distribution.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate service line distribution."));
            }
        }

        [HttpGet("status")]
        public async Task<ActionResult<ApiResponse<List<StatusAnalyticsDto>>>> GetStatus([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Status request received.");
            try
            {
                var response = await _dashboardService.GetStatusDistributionAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Status executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Status distribution.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate status distribution."));
            }
        }

        [HttpGet("monthly-trend")]
        public async Task<ActionResult<ApiResponse<List<MonthlyTrendDto>>>> GetMonthlyTrend([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Monthly Trend request received.");
            try
            {
                var response = await _dashboardService.GetMonthlyTrendAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Monthly Trend executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Monthly Trend.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate monthly trend data."));
            }
        }

        [HttpGet("revenue")]
        public async Task<ActionResult<ApiResponse<RevenueAnalyticsDto>>> GetRevenue([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Revenue analytics request received.");
            try
            {
                var response = await _dashboardService.GetRevenueAnalyticsAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Revenue analytics executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Revenue analytics.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate revenue analytics."));
            }
        }

        [HttpGet("managers")]
        public async Task<ActionResult<ApiResponse<List<ManagerAnalyticsDto>>>> GetManagers([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Managers request received.");
            try
            {
                var response = await _dashboardService.GetManagersWorkloadAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Managers executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Dashboard Managers workload.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate manager workloads."));
            }
        }

        [HttpGet("top-accounts")]
        public async Task<ActionResult<ApiResponse<List<TopAccountDto>>>> GetTopAccounts([FromQuery] DashboardFilterRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Dashboard Top Accounts request received.");
            try
            {
                var response = await _dashboardService.GetTopAccountsAsync(request);
                stopwatch.Stop();
                _logger.LogInformation("Dashboard Top Accounts executed in {ElapsedMs} ms", stopwatch.ElapsedMilliseconds);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compute Top Accounts ranking.");
                return StatusCode(500, ApiResponse.CreateFailure("Failed to calculate top accounts ranking."));
            }
        }
    }
}
