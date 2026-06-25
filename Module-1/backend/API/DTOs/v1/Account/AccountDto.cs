using System;

namespace API.DTOs.v1.Account
{
    public class AccountDto
    {
        public string Id { get; set; } = string.Empty; // Maps Guid to string for frontend

        public string Name { get; set; } = string.Empty;

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
    }
}
