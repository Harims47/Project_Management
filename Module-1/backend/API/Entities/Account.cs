using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Account : BaseEntity
    {
        public Guid AccountId { get; set; }

        public string AccountName { get; set; } = string.Empty;

        public string GlobalLead { get; set; } = string.Empty;

        public string? DeliveryManager { get; set; }

        public string Region { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Website { get; set; } = string.Empty;

        public string ContactEmail { get; set; } = string.Empty;

        public string Tier { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Status { get; set; } = "Active";

        // Navigation properties
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
