using System;

namespace API.Entities
{
    public class Project : BaseEntity
    {
        public Guid ProjectId { get; set; }

        public Guid AccountId { get; set; }

        public string ProjectCode { get; set; } = string.Empty;

        public string ProjectName { get; set; } = string.Empty;

        public int ServiceId { get; set; }

        public int StatusId { get; set; }

        public string Manager { get; set; } = string.Empty;

        public decimal Revenue { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Remarks { get; set; }

        // Navigation properties
        public virtual Account Account { get; set; } = null!;
        public virtual Service Service { get; set; } = null!;
        public virtual ProjectStatus Status { get; set; } = null!;
    }
}
