using System.ComponentModel.DataAnnotations;

namespace API.DTOs.v1.Project
{
    public class ProjectCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string ProjectCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        public string ClientId { get; set; } = string.Empty; // Guid string

        [Required]
        [MaxLength(100)]
        public string Manager { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Service { get; set; } = string.Empty; // "Creative", "Digital", "Research", "Video"

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty; // "Completed", "Ongoing", "Pipeline", "Cancelled"

        [Required]
        public decimal Revenue { get; set; }

        [Required]
        public string StartDate { get; set; } = string.Empty; // "yyyy-MM-dd"

        [Required]
        public string EndDate { get; set; } = string.Empty; // "yyyy-MM-dd"

        [MaxLength(1000)]
        public string? Remarks { get; set; }
    }
}
