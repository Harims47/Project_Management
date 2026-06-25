using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public abstract class BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string CreatedBy { get; set; } = "System";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(100)]
        public string UpdatedBy { get; set; } = "System";

        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        [Timestamp]
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }
}
