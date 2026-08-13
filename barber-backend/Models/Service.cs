namespace barber_backend.Models;

public class Service
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = "";

    public ICollection<StaffService> StaffServices { get; set; } = [];
}
