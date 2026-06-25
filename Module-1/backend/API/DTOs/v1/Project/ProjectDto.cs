namespace API.DTOs.v1.Project
{
    public class ProjectDto
    {
        public string Id { get; set; } = string.Empty; // Maps Guid to string for frontend

        public string ProjectCode { get; set; } = string.Empty;

        public string ProjectName { get; set; } = string.Empty;

        public string ClientId { get; set; } = string.Empty; // Maps Guid to string

        public string ClientName { get; set; } = string.Empty;

        public string Manager { get; set; } = string.Empty;

        public string Service { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public decimal Revenue { get; set; }

        public string StartDate { get; set; } = string.Empty; // formatted as "yyyy-MM-dd"

        public string EndDate { get; set; } = string.Empty; // formatted as "yyyy-MM-dd"

        public string? Remarks { get; set; }
    }
}
