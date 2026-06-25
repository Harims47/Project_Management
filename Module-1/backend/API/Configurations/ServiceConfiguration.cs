using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Configurations
{
    public class ServiceConfiguration : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            builder.ToTable("Services");

            builder.HasKey(s => s.ServiceId);

            builder.Property(s => s.ServiceId)
                .ValueGeneratedNever(); // Manually seeded

            builder.Property(s => s.ServiceName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(s => s.CreatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.UpdatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();
        }
    }
}
