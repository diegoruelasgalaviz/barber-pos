namespace barber_backend.Models;

public class Staff
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public UserRole Role { get; set; } = UserRole.Staff;
    public string Title { get; set; } = "";
    public string Color { get; set; } = "#0f172a";
    public string PhotoInitials { get; set; } = "";
    public bool Active { get; set; } = true;

    /// <summary>Keyed 0 (Sunday) .. 6 (Saturday), stored as jsonb.</summary>
    public Dictionary<int, DayHours> WorkingHours { get; set; } = [];

    public ICollection<StaffService> StaffServices { get; set; } = [];
    public ICollection<Appointment> Appointments { get; set; } = [];
}
