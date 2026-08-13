namespace barber_backend.Models;

/// <summary>Singleton settings row (single record, well-known Id = 1).</summary>
public class BusinessProfile
{
    public int Id { get; set; } = 1;
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string Zip { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Website { get; set; } = "";
    public Dictionary<int, DayHours> Hours { get; set; } = [];
}

public class NotificationPrefs
{
    public int Id { get; set; } = 1;
    public bool EmailReminders { get; set; }
    public bool SmsReminders { get; set; }
    public int ReminderLeadHours { get; set; } = 24;
    public bool NewBookingAlerts { get; set; } = true;
    public bool LowStockAlerts { get; set; } = true;
}

public class PaymentTaxSettings
{
    public int Id { get; set; } = 1;
    public string Currency { get; set; } = "USD";
    public decimal TaxRate { get; set; }
    public bool AcceptsCard { get; set; } = true;
    public bool AcceptsCash { get; set; } = true;
    public bool TippingEnabled { get; set; } = true;
    public int[] DefaultTipPercents { get; set; } = [15, 20, 25];
}
