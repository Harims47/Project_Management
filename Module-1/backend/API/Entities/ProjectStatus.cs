using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class ProjectStatus : BaseEntity
    {
        public int StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
