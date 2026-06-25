namespace API.DTOs.v1.Dashboard
{
    public class DashboardSummaryDto
    {
        public int TotalAccounts { get; set; }
        public int TotalProjects { get; set; }
        public decimal TotalRevenue { get; set; }
        public int ActiveProjects { get; set; }
        public int CompletedProjects { get; set; }
        public int PipelineProjects { get; set; }
        public int CancelledProjects { get; set; }
        public int OngoingProjects { get; set; }
    }
}
