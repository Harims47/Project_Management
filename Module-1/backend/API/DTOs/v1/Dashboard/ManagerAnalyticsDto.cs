namespace API.DTOs.v1.Dashboard
{
    public class ManagerAnalyticsDto
    {
        public string Manager { get; set; } = string.Empty;
        public int ProjectCount { get; set; }
        public decimal Revenue { get; set; }
        public int CompletedProjects { get; set; }
        public int OngoingProjects { get; set; }
    }
}
