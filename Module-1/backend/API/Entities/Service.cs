using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Service : BaseEntity
    {
        public int ServiceId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
