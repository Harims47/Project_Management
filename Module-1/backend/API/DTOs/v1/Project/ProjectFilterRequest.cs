namespace API.DTOs.v1.Project
{
    public class ProjectFilterRequest
    {
        public string? Search { get; set; }
        
        public string? ProjectCodes { get; set; } // Comma or space separated codes

        public string? AccountId { get; set; } // Guid string

        public string? Service { get; set; } // e.g. "Creative"

        public string? Status { get; set; } // e.g. "Ongoing"

        public string? Manager { get; set; }

        public decimal? RevenueMin { get; set; }

        public decimal? RevenueMax { get; set; }

        public string? StartDate { get; set; } // "yyyy-MM-dd"

        public string? EndDate { get; set; } // "yyyy-MM-dd"

        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 1000; // Default to a large page size to support client-side grid components

        public string? SortColumn { get; set; } = "ProjectCode";

        public string? SortDirection { get; set; } = "asc"; // "asc" | "desc"
    }
}
