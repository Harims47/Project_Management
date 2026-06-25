namespace API.DTOs.v1.Dashboard
{
    public class MonthlyTrendDto
    {
        public string Month { get; set; } = string.Empty;
        public int ProjectsCreated { get; set; }
        public decimal Revenue { get; set; }
        public double Completion { get; set; } // Completion rate %
    }
}
