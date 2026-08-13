namespace barber_backend.Models;

public class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string? GuestName { get; set; }
    public string? GuestContact { get; set; }

    public Guid StaffId { get; set; }
    public Staff Staff { get; set; } = null!;
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;

    public string Date { get; set; } = ""; // yyyy-MM-dd
    public string StartTime { get; set; } = ""; // HH:mm
    public int DurationMinutes { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public string? Notes { get; set; }

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.DueAtShop;
    public Guid? DiscountId { get; set; }
    public Discount? Discount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
