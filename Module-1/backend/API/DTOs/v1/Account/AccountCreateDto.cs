using System.ComponentModel.DataAnnotations;

namespace API.DTOs.v1.Account
{
    public class AccountCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string GlobalLead { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? DeliveryManager { get; set; }

        [Required]
        [MaxLength(50)]
        public string Region { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Industry { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [MaxLength(250)]
        public string Website { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string ContactEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Tier { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active";
    }
}
