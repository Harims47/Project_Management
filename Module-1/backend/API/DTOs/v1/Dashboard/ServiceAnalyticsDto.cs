namespace API.DTOs.v1.Dashboard
{
    public class ServiceAnalyticsDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public int TotalProjects { get; set; }
        public decimal Revenue { get; set; }
        public double CompletionPercentage { get; set; }
        public int ActiveProjects { get; set; }
    }
}
