using barber_backend.Models;

namespace barber_backend.DTOs;

public static class Mappings
{
    public static CustomerDto ToDto(this Customer c) => new(c.Id, c.FirstName, c.LastName, c.Email, c.Phone, c.Notes, c.Tags, c.CreatedAt);

    public static ServiceDto ToDto(this Service s) => new(s.Id, s.Name, s.Description, s.DurationMinutes, s.Price, s.Category);

    public static StaffDto ToDto(this Staff s) => new(
        s.Id, s.Name, s.Email, s.Role, s.Title, s.Color, s.PhotoInitials,
        s.StaffServices.Select(ss => ss.ServiceId.ToString()).ToArray(), s.WorkingHours, s.Active);

    public static AppointmentDto ToDto(this Appointment a) => new(
        a.Id, a.CustomerId, a.GuestName, a.GuestContact, a.StaffId, a.ServiceId,
        a.Date, a.StartTime, a.DurationMinutes, a.Status, a.Notes,
        a.PaymentMethod, a.PaymentStatus, a.DiscountId, a.CreatedAt);

    public static ProductDto ToDto(this Product p) => new(p.Id, p.Name, p.Sku, p.Category, p.Stock, p.LowStockThreshold, p.UnitCost, p.UnitPrice, p.Supplier);

    public static StockAdjustmentDto ToDto(this StockAdjustment s) => new(s.Id, s.ProductId, s.Delta, s.Reason, s.CreatedAt);

    public static BusinessProfileDto ToDto(this BusinessProfile b) => new(b.Name, b.Address, b.City, b.State, b.Zip, b.Phone, b.Email, b.Website, b.Hours);

    public static NotificationPrefsDto ToDto(this NotificationPrefs n) => new(n.EmailReminders, n.SmsReminders, n.ReminderLeadHours, n.NewBookingAlerts, n.LowStockAlerts);

    public static PaymentTaxSettingsDto ToDto(this PaymentTaxSettings p) => new(p.Currency, p.TaxRate, p.AcceptsCard, p.AcceptsCash, p.TippingEnabled, p.DefaultTipPercents);

    public static PluginDto ToDto(this Plugin p) => new(p.Id, p.Name, p.Description, p.Category, p.Enabled, p.Configured);

    public static DiscountDto ToDto(this Discount d) => new(d.Id, d.Title, d.Description, d.PercentOff, d.Code, d.ExpiresAt);

    public static AuthUserDto ToAuthDto(this ApplicationUser u) => new(u.Id, u.Name, u.Email, u.Phone, u.Role, u.AvatarColor);
}
