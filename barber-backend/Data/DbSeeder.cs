using barber_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(BarberDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Users.AnyAsync())
        {
            db.Users.Add(new ApplicationUser
            {
                Name = "Alex Rivera",
                Email = "owner@barber.dev",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Phone = "555-0100",
                Role = UserRole.Owner,
                AvatarColor = "#7c3aed",
            });
        }

        if (!await db.Services.AnyAsync())
        {
            db.Services.AddRange(
                new Service { Name = "Classic Haircut", Description = "Precision cut and style.", DurationMinutes = 30, Price = 35, Category = "Hair" },
                new Service { Name = "Beard Trim", Description = "Shape and line up.", DurationMinutes = 20, Price = 20, Category = "Beard" },
                new Service { Name = "Hot Towel Shave", Description = "Classic straight razor shave.", DurationMinutes = 40, Price = 45, Category = "Shave" }
            );
        }
        await db.SaveChangesAsync();

        if (!await db.Staff.AnyAsync())
        {
            var services = await db.Services.ToListAsync();
            var hours = Enumerable.Range(0, 7).ToDictionary(d => d, d => new DayHours { Start = "09:00", End = "18:00", Closed = d == 0 });

            var maria = new Staff { Name = "Maria Gomez", Email = "maria@barber.dev", Role = UserRole.Staff, Title = "Senior Barber", Color = "#0ea5e9", PhotoInitials = "MG", WorkingHours = hours, Active = true };
            var jon = new Staff { Name = "Jon Blake", Email = "jon@barber.dev", Role = UserRole.Staff, Title = "Barber", Color = "#f97316", PhotoInitials = "JB", WorkingHours = hours, Active = true };
            db.Staff.AddRange(maria, jon);
            await db.SaveChangesAsync();

            foreach (var s in services)
            {
                db.StaffServices.Add(new StaffService { StaffId = maria.Id, ServiceId = s.Id });
                db.StaffServices.Add(new StaffService { StaffId = jon.Id, ServiceId = s.Id });
            }
        }

        if (!await db.Plugins.AnyAsync())
        {
            db.Plugins.AddRange(
                new Plugin { Name = "SMS Reminders", Description = "Send automated SMS reminders.", Category = PluginCategory.Marketing, Enabled = true, Configured = true },
                new Plugin { Name = "Loyalty Points", Description = "Reward repeat customers.", Category = PluginCategory.Loyalty, Enabled = false, Configured = false }
            );
        }

        if (!await db.Discounts.AnyAsync())
        {
            db.Discounts.Add(new Discount { Title = "New Client 15% Off", Description = "First visit discount.", PercentOff = 15, Code = "WELCOME15", ExpiresAt = DateTime.UtcNow.AddMonths(3) });
        }

        if (!await db.BusinessProfiles.AnyAsync())
        {
            db.BusinessProfiles.Add(new BusinessProfile
            {
                Name = "Downtown Barber Co.",
                Address = "123 Main St",
                City = "Austin",
                State = "TX",
                Zip = "78701",
                Phone = "555-0100",
                Email = "hello@barber.dev",
                Website = "https://barber.dev",
                Hours = Enumerable.Range(0, 7).ToDictionary(d => d, d => new DayHours { Start = "09:00", End = "18:00", Closed = d == 0 }),
            });
        }

        if (!await db.NotificationPrefs.AnyAsync())
            db.NotificationPrefs.Add(new NotificationPrefs());

        if (!await db.PaymentTaxSettings.AnyAsync())
            db.PaymentTaxSettings.Add(new PaymentTaxSettings { TaxRate = 8.25m });

        await db.SaveChangesAsync();
    }
}
