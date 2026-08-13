using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using barber_backend.Models;

namespace barber_backend.Data;

public class BarberDbContext(DbContextOptions<BarberDbContext> options) : DbContext(options)
{
    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Staff> Staff => Set<Staff>();
    public DbSet<StaffService> StaffServices => Set<StaffService>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockAdjustment> StockAdjustments => Set<StockAdjustment>();
    public DbSet<BusinessProfile> BusinessProfiles => Set<BusinessProfile>();
    public DbSet<NotificationPrefs> NotificationPrefs => Set<NotificationPrefs>();
    public DbSet<PaymentTaxSettings> PaymentTaxSettings => Set<PaymentTaxSettings>();
    public DbSet<Plugin> Plugins => Set<Plugin>();
    public DbSet<Discount> Discounts => Set<Discount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var workingHoursComparer = new ValueComparer<Dictionary<int, DayHours>>(
            (a, b) => JsonSerializer.Serialize(a, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(b, (JsonSerializerOptions?)null),
            d => JsonSerializer.Serialize(d, (JsonSerializerOptions?)null).GetHashCode(),
            d => JsonSerializer.Deserialize<Dictionary<int, DayHours>>(JsonSerializer.Serialize(d, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null)!);

        modelBuilder.Entity<ApplicationUser>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Staff>(e =>
        {
            e.Property(s => s.WorkingHours)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<Dictionary<int, DayHours>>(v, (JsonSerializerOptions?)null) ?? new())
                .Metadata.SetValueComparer(workingHoursComparer);
        });

        modelBuilder.Entity<BusinessProfile>(e =>
        {
            e.Property(s => s.Hours)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<Dictionary<int, DayHours>>(v, (JsonSerializerOptions?)null) ?? new())
                .Metadata.SetValueComparer(workingHoursComparer);
        });

        modelBuilder.Entity<StaffService>(e =>
        {
            e.HasKey(ss => new { ss.StaffId, ss.ServiceId });
            e.HasOne(ss => ss.Staff).WithMany(s => s.StaffServices).HasForeignKey(ss => ss.StaffId);
            e.HasOne(ss => ss.Service).WithMany(s => s.StaffServices).HasForeignKey(ss => ss.ServiceId);
        });

        modelBuilder.Entity<Appointment>(e =>
        {
            e.HasOne(a => a.Customer).WithMany(c => c.Appointments).HasForeignKey(a => a.CustomerId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(a => a.Staff).WithMany(s => s.Appointments).HasForeignKey(a => a.StaffId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Service).WithMany().HasForeignKey(a => a.ServiceId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Discount).WithMany().HasForeignKey(a => a.DiscountId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<StockAdjustment>(e =>
        {
            e.HasOne(sa => sa.Product).WithMany(p => p.StockAdjustments).HasForeignKey(sa => sa.ProductId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
