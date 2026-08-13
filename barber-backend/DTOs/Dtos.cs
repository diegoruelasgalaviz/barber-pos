using barber_backend.Models;

namespace barber_backend.DTOs;

public record AuthUserDto(Guid Id, string Name, string Email, string Phone, UserRole Role, string AvatarColor);
public record AuthResponse(string Token, AuthUserDto User);
public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password, string? Phone);

public record CustomerDto(Guid Id, string FirstName, string LastName, string Email, string Phone, string Notes, string[] Tags, DateTime CreatedAt);
public record CustomerUpsertRequest(string FirstName, string LastName, string Email, string Phone, string Notes, string[] Tags);

public record ServiceDto(Guid Id, string Name, string Description, int DurationMinutes, decimal Price, string Category);
public record ServiceUpsertRequest(string Name, string Description, int DurationMinutes, decimal Price, string Category);

public record StaffDto(Guid Id, string Name, string Email, UserRole Role, string Title, string Color, string PhotoInitials, string[] ServiceIds, Dictionary<int, DayHours> WorkingHours, bool Active);
public record StaffUpsertRequest(string Name, string Email, string Title, string Color, string[] ServiceIds, Dictionary<int, DayHours> WorkingHours, bool Active);

public record AppointmentDto(
    Guid Id, Guid? CustomerId, string? GuestName, string? GuestContact,
    Guid StaffId, Guid ServiceId, string Date, string StartTime, int DurationMinutes,
    AppointmentStatus Status, string? Notes, PaymentMethod PaymentMethod, PaymentStatus PaymentStatus, Guid? DiscountId, DateTime CreatedAt);

public record AppointmentUpsertRequest(
    Guid? CustomerId, string? GuestName, string? GuestContact,
    Guid StaffId, Guid ServiceId, string Date, string StartTime, int? DurationMinutes,
    AppointmentStatus Status, string? Notes, PaymentMethod PaymentMethod, PaymentStatus PaymentStatus, Guid? DiscountId);

public record ProductDto(Guid Id, string Name, string Sku, string Category, int Stock, int LowStockThreshold, decimal UnitCost, decimal UnitPrice, string Supplier);
public record ProductUpsertRequest(string Name, string Sku, string Category, int Stock, int LowStockThreshold, decimal UnitCost, decimal UnitPrice, string Supplier);
public record StockAdjustmentRequest(int Delta, string Reason);
public record StockAdjustmentDto(Guid Id, Guid ProductId, int Delta, string Reason, DateTime CreatedAt);

public record BusinessProfileDto(string Name, string Address, string City, string State, string Zip, string Phone, string Email, string Website, Dictionary<int, DayHours> Hours);
public record NotificationPrefsDto(bool EmailReminders, bool SmsReminders, int ReminderLeadHours, bool NewBookingAlerts, bool LowStockAlerts);
public record PaymentTaxSettingsDto(string Currency, decimal TaxRate, bool AcceptsCard, bool AcceptsCash, bool TippingEnabled, int[] DefaultTipPercents);

public record PluginDto(Guid Id, string Name, string Description, PluginCategory Category, bool Enabled, bool Configured);
public record PluginUpdateRequest(bool Enabled, bool Configured);

public record DiscountDto(Guid Id, string Title, string Description, decimal PercentOff, string Code, DateTime ExpiresAt);
public record DiscountUpsertRequest(string Title, string Description, decimal PercentOff, string Code, DateTime ExpiresAt);
