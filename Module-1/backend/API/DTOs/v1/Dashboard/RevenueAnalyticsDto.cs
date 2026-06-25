using System.Collections.Generic;

namespace API.DTOs.v1.Dashboard
{
    public class RevenueAnalyticsDto
    {
        public List<RevenueGroupDto> ByService { get; set; } = new();
        public List<RevenueGroupDto> ByMonth { get; set; } = new();
        public List<RevenueGroupDto> ByAccount { get; set; } = new();
    }

    public class RevenueGroupDto
    {
        public string GroupName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }
}
