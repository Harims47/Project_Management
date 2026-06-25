using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Configurations
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Projects");

            builder.HasKey(p => p.ProjectId);

            builder.Property(p => p.ProjectCode)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(p => p.ProjectName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.Manager)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.Revenue)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(p => p.Remarks)
                .HasMaxLength(1000);

            builder.Property(p => p.CreatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.UpdatedBy)
                .IsRequired()
                .HasMaxLength(100);

            // RowVersion for optimistic concurrency
            builder.Property(p => p.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();

            // Indexes for search/filter performance
            builder.HasIndex(p => p.AccountId);
            builder.HasIndex(p => p.ServiceId);
            builder.HasIndex(p => p.StatusId);
            builder.HasIndex(p => p.Manager);
            builder.HasIndex(p => p.StartDate);
            builder.HasIndex(p => p.EndDate);
            builder.HasIndex(p => p.Revenue);
            builder.HasIndex(p => p.CreatedDate);

            // Enforce ProjectCode uniqueness for active records
            builder.HasIndex(p => p.ProjectCode)
                .IsUnique();

            // Relationships
            builder.HasOne(p => p.Account)
                .WithMany(a => a.Projects)
                .HasForeignKey(p => p.AccountId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Service)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Status)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.StatusId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
