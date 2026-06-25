namespace API.DTOs.v1.Dashboard
{
    public class TopAccountDto
    {
        public string AccountId { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int ProjectsCount { get; set; }
        public double CompletionRate { get; set; }
    }
}
