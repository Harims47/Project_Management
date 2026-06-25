using System;

namespace API.DTOs.v1.Dashboard
{
    public class DashboardFilterRequest
    {
        public string? AccountId { get; set; } // Guid string
        public string? Service { get; set; }   // "Creative", etc.
        public string? Status { get; set; }    // "Ongoing", etc.
        public string? Manager { get; set; }
        public string? StartDate { get; set; } // "yyyy-MM-dd"
        public string? EndDate { get; set; }   // "yyyy-MM-dd"
        public decimal? RevenueMin { get; set; }
        public decimal? RevenueMax { get; set; }
    }
}
