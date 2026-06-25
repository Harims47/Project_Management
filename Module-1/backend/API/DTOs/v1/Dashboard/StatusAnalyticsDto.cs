namespace API.DTOs.v1.Dashboard
{
    public class StatusAnalyticsDto
    {
        public string StatusName { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
