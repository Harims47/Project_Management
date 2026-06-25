using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Configurations
{
    public class ProjectStatusConfiguration : IEntityTypeConfiguration<ProjectStatus>
    {
        public void Configure(EntityTypeBuilder<ProjectStatus> builder)
        {
            builder.ToTable("ProjectStatuses");

            builder.HasKey(ps => ps.StatusId);

            builder.Property(ps => ps.StatusId)
                .ValueGeneratedNever(); // Manually seeded

            builder.Property(ps => ps.StatusName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(ps => ps.CreatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(ps => ps.UpdatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(ps => ps.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();
        }
    }
}
