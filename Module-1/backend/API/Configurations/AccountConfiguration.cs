using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Configurations
{
    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.ToTable("Accounts");

            builder.HasKey(a => a.AccountId);

            builder.Property(a => a.AccountName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.GlobalLead)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.DeliveryManager)
                .HasMaxLength(100);

            builder.Property(a => a.Region)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.Industry)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Country)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Website)
                .IsRequired()
                .HasMaxLength(250);

            builder.Property(a => a.ContactEmail)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Tier)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.Description)
                .HasMaxLength(1000);

            builder.Property(a => a.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.CreatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.UpdatedBy)
                .IsRequired()
                .HasMaxLength(100);

            // RowVersion for optimistic concurrency
            builder.Property(a => a.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();

            // Indexes for search/filter performance
            builder.HasIndex(a => a.AccountName);
            builder.HasIndex(a => a.Region);
        }
    }
}
